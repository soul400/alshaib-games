import type {
  TikTokConnectionState,
  AEPEventType,
  AEPRealtimeEvent,
  AEPGatewayHealthMetrics,
  AEPConnectionStatePayload,
} from './types';
import { EventNormalizer } from './EventNormalizer';
import { EventDeduplicator } from './EventDeduplicator';
import { EventSequencer } from './EventSequencer';
import { EventBuffer } from './EventBuffer';
import { EventDispatcher } from './EventDispatcher';
import { HeartbeatMonitor } from './HeartbeatMonitor';
import { HealthMonitor } from './HealthMonitor';
import { TikTokRoomManager } from './TikTokRoomManager';

export class TikTokConnectionManager {
  private static instance: TikTokConnectionManager | null = null;

  // Subsystems
  private normalizer = EventNormalizer;
  private deduplicator = new EventDeduplicator(30000, 10000);
  private sequencer = new EventSequencer();
  private buffer = new EventBuffer(500);
  private dispatcher = new EventDispatcher();
  private heartbeat = new HeartbeatMonitor(10000, 120000);
  private health = new HealthMonitor();
  private room = new TikTokRoomManager();

  // Connection State
  private state: TikTokConnectionState = 'IDLE';
  private currentUsername: string = 'soul80813';
  private tiktokLiveClient: any = null;
  private connectLock: Promise<void> | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private currentAttempt: number = 0;
  private isIntentionallyClosed: boolean = false;

  // Config
  private readonly initialBackoffMs = 2000;
  private readonly maxBackoffMs = 32000;
  private readonly maxReconnectAttempts = 10;
  private readonly connectTimeoutMs = 12000;

  private constructor() {
    // Start heartbeat monitor
    this.heartbeat.start(
      () => this.emitPing(),
      (ageMs) => this.handleStaleStream(ageMs)
    );
  }

  public static getInstance(): TikTokConnectionManager {
    if (!TikTokConnectionManager.instance) {
      TikTokConnectionManager.instance = new TikTokConnectionManager();
    }
    return TikTokConnectionManager.instance;
  }

  /**
   * Transition state and notify subscribers
   */
  private setState(newState: TikTokConnectionState, message: string = ''): void {
    if (this.state === newState) return;
    const previousState = this.state;
    this.state = newState;

    const payload: AEPConnectionStatePayload = {
      previousState,
      currentState: newState,
      broadcasterUsername: this.currentUsername,
      roomId: this.room.getRoomInfo().roomId,
      attempt: this.currentAttempt,
      message,
      timestamp: Date.now(),
    };

    const event: AEPRealtimeEvent<AEPConnectionStatePayload> = {
      id: `state-${Date.now()}-${this.sequencer.current()}`,
      seq: this.sequencer.nextSequence(),
      type: 'connection_state',
      timestamp: Date.now(),
      broadcasterUsername: this.currentUsername,
      roomId: this.room.getRoomInfo().roomId,
      payload,
    };

    this.buffer.push(event);
    this.dispatcher.dispatch(event);
  }

  /**
   * Connect to TikTok LIVE for a specific broadcaster
   */
  public async connect(username: string = 'soul80813'): Promise<void> {
    const cleanUsername = username.trim().replace(/^@/, '');
    if (!cleanUsername) throw new Error('Username is required');

    // If already connected or streaming for this broadcaster, return immediately
    if (
      (this.state === 'CONNECTED' || this.state === 'STREAMING') &&
      this.currentUsername === cleanUsername &&
      this.tiktokLiveClient
    ) {
      return;
    }

    // Mutex lock to serialize concurrent calls
    if (this.connectLock) {
      return this.connectLock;
    }

    this.connectLock = this.executeConnect(cleanUsername);
    try {
      await this.connectLock;
    } finally {
      this.connectLock = null;
    }
  }

  private async executeConnect(username: string): Promise<void> {
    // If broadcaster changed, clean up previous connection
    if (this.currentUsername !== username && this.tiktokLiveClient) {
      this.cleanupCurrentClient();
    }

    this.currentUsername = username;
    this.room.setBroadcaster(username);
    this.isIntentionallyClosed = false;

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    this.setState('CONNECTING', `⏳ جاري الاتصال ببث @${username}...`);

    try {
      // Dynamically import tiktok-live-connector
      const { TikTokLiveConnection } = await import('tiktok-live-connector');

      const client = new TikTokLiveConnection(username, {
        processInitialData: true,
        enableExtendedGiftInfo: true,
        clientParams: {
          app_language: 'ar-SA',
          webcast_language: 'ar-SA',
        },
        requestOptions: {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
            'Accept-Language': 'ar-SA,ar;q=0.9,en-US;q=0.8,en;q=0.7',
            'Cache-Control': 'no-cache',
          },
          timeout: 8000,
        },
      } as any);

      this.tiktokLiveClient = client;
      this.bindClientListeners(client, username);

      // Connect with timeout
      const connectPromise = client.connect();
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error(`انتهت مهلة الاتصال بعد ${this.connectTimeoutMs / 1000} ثانية`)),
          this.connectTimeoutMs
        )
      );

      const state: any = await Promise.race([connectPromise, timeoutPromise]);

      const roomId = state?.roomId || client.roomId || `room-${Date.now()}`;
      this.room.setRoomConnected(roomId);
      this.currentAttempt = 0;
      this.health.resetReconnectAttempts();
      this.heartbeat.recordActivity();

      this.setState('CONNECTED', `🟢 متصل بنجاح ببث @${username} (Room: ${roomId})`);
      this.setState('STREAMING', `⚡ استقبال تدفق أحداث البث المباشر لـ @${username}`);

      // Emit room info
      this.emitNormalizedEvent(
        this.normalizer.normalizeRoomUpdate(
          { roomId, isLive: true, viewerCount: this.room.getRoomInfo().viewerCount },
          username,
          roomId
        )
      );
    } catch (err: any) {
      console.warn(`[TikTokConnectionManager] Connection failed for @${username}:`, err.message);
      this.cleanupCurrentClient();

      if (!this.isIntentionallyClosed) {
        this.scheduleReconnect(err.message);
      } else {
        this.setState('DISCONNECTED', '🔴 تم إيقاف الاتصال');
      }
    }
  }

  /**
   * Bind event listeners to raw tiktok-live-connector instance
   */
  private bindClientListeners(client: any, username: string): void {
    // Connected
    client.on('connected', (state: any) => {
      const roomId = state?.roomId || client.roomId;
      if (roomId) this.room.setRoomConnected(roomId);
      this.heartbeat.recordActivity();
      this.setState('STREAMING', `⚡ متصل ويستقبل الأحداث لـ @${username}`);
    });

    // Chat / Comments
    client.on('chat', (data: any) => {
      this.health.recordReceived();
      this.heartbeat.recordActivity();

      const normalized = this.normalizer.normalizeChat(
        data,
        username,
        this.room.getRoomInfo().roomId
      );

      // Deduplication check
      if (this.deduplicator.isDuplicate(normalized.id)) {
        return;
      }

      this.emitNormalizedEvent(normalized);
    });

    // Gifts
    client.on('gift', (data: any) => {
      this.health.recordReceived();
      this.heartbeat.recordActivity();

      const normalized = this.normalizer.normalizeGift(
        data,
        username,
        this.room.getRoomInfo().roomId
      );

      if (this.deduplicator.isDuplicate(normalized.id)) {
        return;
      }

      this.emitNormalizedEvent(normalized);
    });

    // Likes
    client.on('like', (data: any) => {
      this.health.recordReceived();
      this.heartbeat.recordActivity();

      const normalized = this.normalizer.normalizeLike(
        data,
        username,
        this.room.getRoomInfo().roomId
      );

      if (data?.totalLikeCount) {
        this.room.updateTotalLikes(Number(data.totalLikeCount));
      }

      if (this.deduplicator.isDuplicate(normalized.id)) {
        return;
      }

      this.emitNormalizedEvent(normalized);
    });

    // Follows
    client.on('follow', (data: any) => {
      this.health.recordReceived();
      this.heartbeat.recordActivity();

      const normalized = this.normalizer.normalizeFollow(
        data,
        username,
        this.room.getRoomInfo().roomId
      );

      if (this.deduplicator.isDuplicate(normalized.id)) {
        return;
      }

      this.emitNormalizedEvent(normalized);
    });

    // Shares
    client.on('share', (data: any) => {
      this.health.recordReceived();
      this.heartbeat.recordActivity();

      const normalized = this.normalizer.normalizeShare(
        data,
        username,
        this.room.getRoomInfo().roomId
      );

      if (this.deduplicator.isDuplicate(normalized.id)) {
        return;
      }

      this.emitNormalizedEvent(normalized);
    });

    // Viewers / RoomUser
    client.on('roomUser', (data: any) => {
      this.health.recordReceived();
      this.heartbeat.recordActivity();

      const count = Number(data?.viewerCount || data?.userCount || 0);
      this.room.updateViewerCount(count);

      const normalized = this.normalizer.normalizeViewerUpdate(
        count,
        username,
        this.room.getRoomInfo().roomId
      );

      this.emitNormalizedEvent(normalized);
    });

    // Stream End
    client.on('streamEnd', () => {
      this.setState('DISCONNECTED', `🔴 انتهى بث @${username}`);
      this.cleanupCurrentClient();
    });

    // Disconnected
    client.on('disconnected', () => {
      if (!this.isIntentionallyClosed) {
        this.scheduleReconnect('انقطع اتصال الـ WebSocket من تيك توك');
      } else {
        this.setState('DISCONNECTED', '🔴 تم إغلاق الاتصال بنجاح');
      }
    });

    // Error
    client.on('error', (err: any) => {
      console.warn(`[TikTokConnectionManager] Socket error for @${username}:`, err?.message || err);
      if (this.state === 'STREAMING') {
        this.setState('DEGRADED', `⚠️ خطأ في الاتصال: ${err?.message || 'مشكلة في الشبكة'}`);
      }
    });
  }

  /**
   * Emits a normalized event through sequencer, buffer, and dispatcher
   */
  private emitNormalizedEvent(rawEvent: Omit<AEPRealtimeEvent, 'seq'>): void {
    const fullEvent: AEPRealtimeEvent = {
      ...rawEvent,
      seq: this.sequencer.nextSequence(),
    };

    this.health.recordEmitted();
    this.buffer.push(fullEvent);
    this.dispatcher.dispatch(fullEvent);
  }

  /**
   * Schedule exponential backoff reconnection
   */
  private scheduleReconnect(reason: string): void {
    if (this.isIntentionallyClosed) return;

    this.cleanupCurrentClient();
    this.currentAttempt++;
    this.health.recordReconnectAttempt();

    if (this.currentAttempt > this.maxReconnectAttempts) {
      this.setState(
        'FAILED',
        `❌ فشل الاتصال بعد ${this.maxReconnectAttempts} محاولات. تأكد أن الحساب @${this.currentUsername} يبث الآن، أو فعّل "البث التجريبي".`
      );
      return;
    }

    // Exponential backoff + jitter
    const backoff = Math.min(
      this.initialBackoffMs * Math.pow(2, this.currentAttempt - 1),
      this.maxBackoffMs
    );
    const jitter = Math.floor(Math.random() * 1000);
    const delay = backoff + jitter;

    this.setState(
      'BACKOFF',
      `🔄 إعادة المحاولة ${this.currentAttempt}/${this.maxReconnectAttempts} بعد ${Math.round(delay / 1000)} ثانية (${reason})`
    );

    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    this.reconnectTimeout = setTimeout(() => {
      if (!this.isIntentionallyClosed) {
        this.setState('RECONNECTING', `⏳ محاولة إعادة الاتصال رقم ${this.currentAttempt}...`);
        this.executeConnect(this.currentUsername).catch(() => {});
      }
    }, delay);
  }

  /**
   * Handle stale stream detection
   */
  private handleStaleStream(ageMs: number): void {
    if (this.state === 'STREAMING') {
      console.warn(`[TikTokConnectionManager] Stream stale (${Math.round(ageMs / 1000)}s without events)`);
      this.setState(
        'DEGRADED',
        `⚠️ لم يتم استقبال أحداث منذ ${Math.round(ageMs / 1000)} ثانية (تحقق من استقرار البث)`
      );
    }
  }

  /**
   * Send periodic ping event to all active SSE subscribers
   */
  private emitPing(): void {
    const pingEvent: AEPRealtimeEvent = {
      id: `ping-${Date.now()}`,
      seq: this.sequencer.nextSequence(),
      type: 'ping',
      timestamp: Date.now(),
      broadcasterUsername: this.currentUsername,
      roomId: this.room.getRoomInfo().roomId,
      payload: {
        timestamp: Date.now(),
        subscribers: this.dispatcher.subscriberCount(),
      },
    };
    this.dispatcher.dispatch(pingEvent);
  }

  /**
   * Cleanup current raw client without changing desired state to closed
   */
  private cleanupCurrentClient(): void {
    if (this.tiktokLiveClient) {
      try {
        this.tiktokLiveClient.removeAllListeners();
        this.tiktokLiveClient.disconnect();
      } catch (_) {}
      this.tiktokLiveClient = null;
    }
  }

  /**
   * Explicit user/admin disconnect
   */
  public disconnect(): void {
    this.isIntentionallyClosed = true;
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    this.cleanupCurrentClient();
    this.setState('DISCONNECTED', '🔴 تم إيقاف الاتصال يدوياً');
  }

  /**
   * Force reconnect now
   */
  public async forceReconnect(): Promise<void> {
    this.disconnect();
    this.currentAttempt = 0;
    this.health.resetReconnectAttempts();
    await this.connect(this.currentUsername);
  }

  /**
   * Subscribe to live events (Used by SSE route handler)
   */
  public subscribe(
    filter: AEPEventType | '*',
    callback: (event: AEPRealtimeEvent) => void
  ): () => void {
    return this.dispatcher.subscribe(filter, callback);
  }

  /**
   * Get recent events for hydrating newly connected clients
   */
  public getRecentEvents(count: number = 50): AEPRealtimeEvent[] {
    return this.buffer.getRecent(count);
  }

  /**
   * Get comprehensive health metrics
   */
  public getHealth(): AEPGatewayHealthMetrics {
    return this.health.getMetrics({
      status: this.state,
      broadcasterUsername: this.currentUsername,
      roomId: this.room.getRoomInfo().roomId,
      activeSubscribers: this.dispatcher.subscriberCount(),
      lastEventTimestamp: this.heartbeat.getLastEventAt(),
      stalenessThresholdMs: 120000,
      bufferSize: this.buffer.size(),
      dedupCacheSize: this.deduplicator.size(),
    });
  }

  public getState(): TikTokConnectionState {
    return this.state;
  }

  public getBroadcaster(): string {
    return this.currentUsername;
  }

  public getSubscriberCount(): number {
    return this.dispatcher.subscriberCount();
  }
}
