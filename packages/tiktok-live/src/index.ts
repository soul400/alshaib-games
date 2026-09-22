import {
  PlayerScore,
  TikTokLiveComment,
  WinnerAnnouncement,
  AEPRealtimeEvent,
  AEPGiftPayload,
  AEPLikePayload,
  AEPFollowPayload,
  AEPSharePayload,
  TikTokConnectionState,
} from '@aep/types';
import { isAnswerMatch } from '@aep/game-engines';

export type TikTokCommentCallback = (comment: TikTokLiveComment) => void;
export type WinnerCallback = (winner: WinnerAnnouncement) => void;
export type StreamStatusCallback = (status: LiveRoomStatus) => void;
export type CorrectAnswerCallback = (data: { player: PlayerScore; pointsEarned: number; rank: number }) => void;
export type AEPRealtimeEventCallback = (event: AEPRealtimeEvent) => void;
export type AEPGiftCallback = (gift: AEPGiftPayload) => void;
export type AEPLikeCallback = (like: AEPLikePayload) => void;
export type AEPFollowCallback = (follow: AEPFollowPayload) => void;
export type AEPShareCallback = (share: AEPSharePayload) => void;

export interface LiveRoomStatus {
  isOnline: boolean;
  username: string;
  roomId?: string;
  title?: string;
  viewerCount?: number;
  avatarUrl?: string;
  statusText: string;
  lastCheckedTime: number;
  connectionState?: TikTokConnectionState;
}

/**
 * Client-side Arabic text normalizer for answer matching
 */
function normalizeArabic(text: string): string {
  if (!text) return '';
  let s = text.trim();
  // Strip tashkeel
  s = s.replace(/[\u064B-\u0652\u0670]/g, '');
  // Strip tatweel
  s = s.replace(/\u0640/g, '');
  // Convert Eastern numerals
  const easternDigits: Record<string, string> = {
    '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
    '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9',
  };
  s = s.replace(/[٠-٩]/g, (d) => easternDigits[d] || d);
  // Normalize alifs, tah marbutah, alif maqsura
  s = s.replace(/[أإآٱ]/g, 'ا');
  s = s.replace(/ة/g, 'ه');
  s = s.replace(/ى/g, 'ي');
  return s.replace(/\s+/g, ' ').trim().toLowerCase();
}

/**
 * TikTok Live Engine - Persistent Real-Time Bridge
 * 
 * Connects to TikTok Live streams via the Next.js server-side SSE Gateway
 * which maintains a persistent, authoritative session with multi-client fanout.
 */
export class TikTokLiveEngine {
  private isConnected: boolean = false;
  private channelName: string = '';
  private roomStatus: LiveRoomStatus = {
    isOnline: false,
    username: '',
    statusText: 'غير متصل (Offline)',
    lastCheckedTime: Date.now(),
    connectionState: 'IDLE',
  };

  // Listeners
  private commentListeners: Set<TikTokCommentCallback> = new Set();
  private winnerListeners: Set<WinnerCallback> = new Set();
  private statusListeners: Set<StreamStatusCallback> = new Set();
  private correctAnswerListeners: Set<CorrectAnswerCallback> = new Set();
  private eventListeners: Set<AEPRealtimeEventCallback> = new Set();
  private giftListeners: Set<AEPGiftCallback> = new Set();
  private likeListeners: Set<AEPLikeCallback> = new Set();
  private followListeners: Set<AEPFollowCallback> = new Set();
  private shareListeners: Set<AEPShareCallback> = new Set();

  private eventSource: EventSource | null = null;
  private simulationInterval: any = null;
  private liveCommentsList: TikTokLiveComment[] = [];

  private currentAcceptableAnswers: string[] = [];
  private currentQuestionTitle: string = '';
  private currentQuestionPoints: number = 100;
  private currentEngineType: string = 'quiz';
  private leaderboard: Map<string, PlayerScore> = new Map();
  private roundWinnerDeclared: boolean = false;

  private isAcceptingAnswers: boolean = true;

  // Track correct answer count & user deduplication per question
  private correctAnswerCountThisQuestion: number = 0;
  private answeredUserIdsThisQuestion: Set<string> = new Set();
  private reconnectTimeout: any = null;

  constructor() {
    this.loadPersistedLeaderboard();
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.disconnect();
      });
    }
  }

  private loadPersistedLeaderboard(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const saved = localStorage.getItem('aep_live_leaderboard');
        if (saved) {
          const list: PlayerScore[] = JSON.parse(saved);
          if (Array.isArray(list)) {
            list.forEach((p) => {
              const key = p.userId || p.id;
              if (key) {
                this.leaderboard.set(key, {
                  ...p,
                  id: p.id || key,
                  userId: p.userId || key,
                });
              }
            });
            this.updateRanks();
          }
        }
      } catch (e) {
        console.warn('Error loading leaderboard from localStorage:', e);
      }
    }
  }

  public persistLeaderboard(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const list = Array.from(this.leaderboard.values());
        localStorage.setItem('aep_live_leaderboard', JSON.stringify(list));
      } catch (e) {
        console.warn('Error saving leaderboard to localStorage:', e);
      }
    }
  }

  /**
   * Award points directly to a player and persist immediately
   */
  public awardPoints(playerInfo: {
    userId: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
    points: number;
  }): PlayerScore {
    const key = playerInfo.userId;
    let player = this.leaderboard.get(key);
    if (!player) {
      player = {
        id: key,
        userId: key,
        username: playerInfo.username,
        displayName: playerInfo.displayName || playerInfo.username,
        avatarUrl: playerInfo.avatarUrl || '',
        score: 0,
        correctAnswersCount: 0,
        rank: this.leaderboard.size + 1,
      };
    }

    player.score += playerInfo.points;
    player.correctAnswersCount += 1;
    this.leaderboard.set(key, player);
    this.updateRanks();
    this.persistLeaderboard();

    const finalPlayer = { ...player };
    this.correctAnswerListeners.forEach((cb) =>
      cb({ player: finalPlayer, pointsEarned: playerInfo.points, rank: finalPlayer.rank })
    );

    return finalPlayer;
  }

  /**
   * Connect to TikTok Live Stream via SSE Gateway
   */
  public async connect(channelName: string): Promise<LiveRoomStatus> {
    const cleanUsername = channelName.trim().replace(/^@/, '');

    // Reuse existing active connection if already connected to this channel
    if (
      this.isConnected &&
      this.channelName === cleanUsername &&
      this.eventSource &&
      this.eventSource.readyState !== EventSource.CLOSED
    ) {
      return this.roomStatus;
    }

    this.channelName = cleanUsername;

    // Disconnect previous connection if changing channel
    this.disconnect();

    // Mark as connecting
    this.roomStatus = {
      isOnline: false,
      username: cleanUsername,
      statusText: '⏳ جاري الاتصال بالبث المباشر...',
      lastCheckedTime: Date.now(),
      connectionState: 'CONNECTING',
    };
    this.statusListeners.forEach((cb) => cb(this.roomStatus));

    return new Promise<LiveRoomStatus>((resolve) => {
      const sseUrl = `/api/tiktok-live/stream?username=${encodeURIComponent(cleanUsername)}`;

      this.eventSource = new EventSource(sseUrl);
      this.isConnected = true;

      let resolved = false;
      const resolveOnce = (status: LiveRoomStatus) => {
        if (!resolved) {
          resolved = true;
          resolve(status);
        }
      };

      // When EventSource (re)connects successfully, clear grace timer and restore status
      this.eventSource.onopen = () => {
        // Clear any pending degraded-status grace timer
        if (this.reconnectTimeout) {
          clearTimeout(this.reconnectTimeout);
          this.reconnectTimeout = null;
        }
        // If we were showing DEGRADED from a transient blip, restore to STREAMING
        if (this.roomStatus.connectionState === 'DEGRADED') {
          this.roomStatus = {
            ...this.roomStatus,
            isOnline: true,
            statusText: '🟢 متصل بالبث المباشر',
            connectionState: 'STREAMING',
            lastCheckedTime: Date.now(),
          };
          this.statusListeners.forEach((cb) => cb(this.roomStatus));
        }
      };

      // Listen for unified AEP realtime events
      this.eventSource.addEventListener('aep_event', (event) => {
        try {
          const aepEv: AEPRealtimeEvent = JSON.parse(event.data);
          this.eventListeners.forEach((cb) => cb(aepEv));

          if (aepEv.type === 'gift') {
            this.giftListeners.forEach((cb) => cb(aepEv.payload));
          } else if (aepEv.type === 'like') {
            this.likeListeners.forEach((cb) => cb(aepEv.payload));
          } else if (aepEv.type === 'follow') {
            this.followListeners.forEach((cb) => cb(aepEv.payload));
          } else if (aepEv.type === 'share') {
            this.shareListeners.forEach((cb) => cb(aepEv.payload));
          }
        } catch (_) {}
      });

      // Listen for status events
      this.eventSource.addEventListener('status', (event) => {
        try {
          const data = JSON.parse(event.data);
          this.roomStatus = {
            isOnline: data.isOnline || false,
            username: data.username || cleanUsername,
            roomId: data.roomId,
            statusText: data.message || (data.isOnline ? '🟢 أونلاين' : '🔴 أوفلاين'),
            viewerCount: data.viewerCount,
            lastCheckedTime: Date.now(),
            connectionState: data.type ? data.type.toUpperCase() : undefined,
          };
          this.statusListeners.forEach((cb) => cb(this.roomStatus));

          // Resolve promise on first definitive status
          if (
            data.type === 'live' ||
            data.type === 'connected' ||
            data.type === 'streaming' ||
            data.type === 'offline' ||
            data.type === 'ended' ||
            data.type === 'disconnected' ||
            data.type === 'error' ||
            data.type === 'failed'
          ) {
            resolveOnce(this.roomStatus);
          }
        } catch (e) {
          console.warn('SSE status parse error:', e);
        }
      });

      // Listen for real-time comments
      this.eventSource.addEventListener('comment', (event) => {
        try {
          const data = JSON.parse(event.data);
          const comment: TikTokLiveComment = {
            id: data.id || `tt-${Date.now()}`,
            userId: String(data.userId),
            username: data.username,
            displayName: data.displayName,
            avatarUrl: data.avatarUrl || '',
            comment: data.comment,
            timestamp: data.timestamp || Date.now(),
          };
          this.processComment(comment);
        } catch (e) {
          console.warn('SSE comment parse error:', e);
        }
      });

      // Listen for room info (viewer count updates)
      this.eventSource.addEventListener('roomInfo', (event) => {
        try {
          const data = JSON.parse(event.data);
          if (typeof data.viewerCount === 'number') {
            this.roomStatus.viewerCount = data.viewerCount;
          }
          if (data.roomId) {
            this.roomStatus.roomId = data.roomId;
          }
          this.roomStatus.lastCheckedTime = Date.now();
          this.statusListeners.forEach((cb) => cb(this.roomStatus));
        } catch (e) {}
      });

      // Handle EventSource connection errors
      this.eventSource.onerror = (e: Event) => {
        if (e) {
          try {
            if (typeof (e as any).preventDefault === 'function') (e as any).preventDefault();
            if (typeof (e as any).stopPropagation === 'function') (e as any).stopPropagation();
          } catch (_) {}
        }

        const es = this.eventSource;
        if (!es) return;

        // CASE 1: Browser is auto-reconnecting (readyState === CONNECTING = 0)
        // Do NOT close the EventSource! The browser will reconnect natively in 1-2s.
        // Set a grace timer to show DEGRADED only if it stays disconnected for 6s.
        if (es.readyState === EventSource.CONNECTING) {
          // Only start grace timer once (avoid stacking)
          if (!this.reconnectTimeout) {
            this.reconnectTimeout = setTimeout(() => {
              this.reconnectTimeout = null;
              // After grace period, check if still struggling
              if (this.eventSource && this.eventSource.readyState === EventSource.CONNECTING) {
                this.roomStatus = {
                  ...this.roomStatus,
                  statusText: '🟡 إعادة الاتصال...',
                  connectionState: 'DEGRADED',
                  lastCheckedTime: Date.now(),
                };
                this.statusListeners.forEach((cb) => cb(this.roomStatus));
              }
            }, 6000);
          }
          return; // Let browser reconnect natively — do NOT close or resolve
        }

        // CASE 2: EventSource is fully CLOSED (readyState === 2) — genuine disconnect
        this.roomStatus = {
          isOnline: false,
          username: cleanUsername,
          statusText: '🔴 انقطع الاتصال - جاري إعادة الاتصال...',
          lastCheckedTime: Date.now(),
          connectionState: 'DEGRADED',
        };
        this.statusListeners.forEach((cb) => cb(this.roomStatus));
        resolveOnce(this.roomStatus);

        // Clean up the dead EventSource
        this.isConnected = false;
        if (this.eventSource) {
          try {
            this.eventSource.close();
            this.eventSource = null;
          } catch (_) {}
        }

        // Manual reconnect after 3 seconds
        if (this.channelName) {
          if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
          this.reconnectTimeout = setTimeout(() => {
            this.reconnectTimeout = null;
            if (!this.isConnected && this.channelName) {
              this.connect(this.channelName).catch(() => {});
            }
          }, 3000);
        }
      };

      // Timeout fallback after 15 seconds
      setTimeout(() => {
        if (!resolved) {
          this.roomStatus = {
            isOnline: false,
            username: cleanUsername,
            statusText: '🔴 انتهت مهلة الاتصال - تأكد أن البث نشط',
            lastCheckedTime: Date.now(),
            connectionState: 'FAILED',
          };
          this.statusListeners.forEach((cb) => cb(this.roomStatus));
          resolveOnce(this.roomStatus);
        }
      }, 15000);
    });
  }

  public async checkRealLiveStatus(username: string): Promise<LiveRoomStatus> {
    return this.connect(username);
  }

  public getDirectWebPlayUrl(baseUrl: string = 'http://localhost:3020'): string {
    return `${baseUrl}/play?channel=${encodeURIComponent(this.channelName)}`;
  }

  public disconnect(): void {
    this.isConnected = false;
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.eventSource) {
      try {
        this.eventSource.close();
      } catch (_) {}
      this.eventSource = null;
    }
    this.stopSimulation();
  }

  public getIsConnected(): boolean {
    return this.isConnected;
  }

  public getChannelName(): string {
    return this.channelName;
  }

  public getRoomStatus(): LiveRoomStatus {
    return this.roomStatus;
  }

  public setActiveQuestion(
    questionTitle: string,
    acceptableAnswers: string[],
    points: number,
    engineType: string = 'quiz'
  ): void {
    this.currentQuestionTitle = questionTitle;
    this.currentAcceptableAnswers = acceptableAnswers;
    this.currentQuestionPoints = points;
    this.currentEngineType = engineType;
    this.roundWinnerDeclared = false;
    this.correctAnswerCountThisQuestion = 0;
    this.answeredUserIdsThisQuestion = new Set();
    this.isAcceptingAnswers = true;
  }

  public setAcceptingAnswers(accepting: boolean): void {
    this.isAcceptingAnswers = accepting;
  }

  // Event Listeners Registration
  public onComment(callback: TikTokCommentCallback): void {
    this.commentListeners.add(callback);
  }

  public offComment(callback: TikTokCommentCallback): void {
    this.commentListeners.delete(callback);
  }

  public onWinner(callback: WinnerCallback): void {
    this.winnerListeners.add(callback);
  }

  public offWinner(callback: WinnerCallback): void {
    this.winnerListeners.delete(callback);
  }

  public onStatus(callback: StreamStatusCallback): void {
    this.statusListeners.add(callback);
  }

  public offStatus(callback: StreamStatusCallback): void {
    this.statusListeners.delete(callback);
  }

  public onCorrectAnswer(callback: CorrectAnswerCallback): void {
    this.correctAnswerListeners.add(callback);
  }

  public offCorrectAnswer(callback: CorrectAnswerCallback): void {
    this.correctAnswerListeners.delete(callback);
  }

  public onEvent(callback: AEPRealtimeEventCallback): void {
    this.eventListeners.add(callback);
  }

  public offEvent(callback: AEPRealtimeEventCallback): void {
    this.eventListeners.delete(callback);
  }

  public onGift(callback: AEPGiftCallback): void {
    this.giftListeners.add(callback);
  }

  public offGift(callback: AEPGiftCallback): void {
    this.giftListeners.delete(callback);
  }

  public onLike(callback: AEPLikeCallback): void {
    this.likeListeners.add(callback);
  }

  public offLike(callback: AEPLikeCallback): void {
    this.likeListeners.delete(callback);
  }

  public onFollow(callback: AEPFollowCallback): void {
    this.followListeners.add(callback);
  }

  public offFollow(callback: AEPFollowCallback): void {
    this.followListeners.delete(callback);
  }

  public onShare(callback: AEPShareCallback): void {
    this.shareListeners.add(callback);
  }

  public offShare(callback: AEPShareCallback): void {
    this.shareListeners.delete(callback);
  }

  public getComments(): TikTokLiveComment[] {
    return [...this.liveCommentsList];
  }

  private calculatePoints(answerOrder: number): number {
    return answerOrder === 1 ? (this.currentQuestionPoints || 1) : 0;
  }

  public processComment(comment: TikTokLiveComment): void {
    this.isConnected = true;

    // Store in global engine comments list (last 100)
    this.liveCommentsList = [comment, ...this.liveCommentsList.slice(0, 99)];

    this.commentListeners.forEach((cb) => cb(comment));

    // Standalone Interactive Engines manage their own scoring & flow
    if (
      this.currentEngineType === 'viewer-race' ||
      this.currentEngineType === 'squid-game' ||
      this.currentEngineType === 'hunter-roulette' ||
      this.currentEngineType === 'mystery-roulette' ||
      this.currentEngineType === 'musical-chairs' ||
      this.currentEngineType === 'the-vault' ||
      this.currentEngineType === 'bomb-pass' ||
      this.currentEngineType === 'react' ||
      this.currentEngineType === 'what-do-they-say' ||
      this.currentEngineType === 'memory-match'
    ) {
      return;
    }

    if (this.currentAcceptableAnswers.length > 0 && this.isAcceptingAnswers) {
      const isMatch =
        isAnswerMatch(comment.comment, this.currentAcceptableAnswers) ||
        this.currentAcceptableAnswers.some((ans) => {
          const normAns = normalizeArabic(ans);
          const normComm = normalizeArabic(comment.comment);
          return normAns === normComm || normComm.includes(normAns);
        });

      if (isMatch) {
        const userKey = String(comment.userId || comment.username || '').toLowerCase().trim();
        const usernameKey = String(comment.username || '').toLowerCase().trim();

        if (
          this.answeredUserIdsThisQuestion.has(userKey) ||
          (usernameKey && this.answeredUserIdsThisQuestion.has(usernameKey))
        ) {
          return;
        }
        this.answeredUserIdsThisQuestion.add(userKey);
        if (usernameKey) this.answeredUserIdsThisQuestion.add(usernameKey);

        this.correctAnswerCountThisQuestion += 1;
        const answerOrder = this.correctAnswerCountThisQuestion;

        const pointsEarned = this.calculatePoints(answerOrder);

        // Only the first correct answer earns points and wins the round
        if (answerOrder > 1) return;

        if (pointsEarned > 0) {
          const key = comment.userId || comment.username;
          let player = this.leaderboard.get(key);
          if (!player) {
            player = {
              id: key,
              userId: key,
              username: comment.username,
              displayName: comment.displayName,
              avatarUrl: comment.avatarUrl,
              score: 0,
              correctAnswersCount: 0,
              rank: this.leaderboard.size + 1,
            };
          }

          player.score += pointsEarned;
          player.correctAnswersCount += 1;
          player.lastCorrectAnswer = comment.comment;
          this.leaderboard.set(key, player);
          this.updateRanks();
          this.persistLeaderboard();

          const finalPlayer = { ...player };
          this.correctAnswerListeners.forEach((cb) =>
            cb({ player: finalPlayer, pointsEarned, rank: answerOrder })
          );
        }

        if (answerOrder === 1) {
          this.roundWinnerDeclared = true;
          const key = comment.userId || comment.username;
          const player = this.leaderboard.get(key)!;
          const winnerAnnouncement: WinnerAnnouncement = {
            player: { ...player },
            questionTitle: this.currentQuestionTitle,
            correctAnswer: this.currentAcceptableAnswers[0],
            pointsEarned,
            timestamp: Date.now(),
          };

          this.winnerListeners.forEach((cb) => cb(winnerAnnouncement));
        }
      }
    }
  }

  public startSimulation(): void {
    if (this.simulationInterval) return;

    const mockUsers = [
      { username: 'streamer_hero', name: 'أحمد السعيد', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80' },
      { username: 'gamer_sa', name: 'سارة خالد', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80' },
      { username: 'faisal_live', name: 'فيصل العتيبي', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&q=80' },
      { username: 'reem_tech', name: 'ريم الشمري', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80' },
      { username: 'king_quiz', name: 'محمد الدوسري', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80' },
    ];

    const randomFillerComments = [
      'مستعدين!! 🔥', 'منور البث يا أسطورة', 'يا رب أفوز اليوم ✨', 'سؤال قوي والله',
      'كفوو المذيع 🔥🔥', 'تحية من الرياض ✨', 'أنا أعرف الإجابة', 'العب 1',
    ];

    this.simulationInterval = setInterval(() => {
      const user = mockUsers[Math.floor(Math.random() * mockUsers.length)];

      let commentText = '';
      if (this.currentAcceptableAnswers.length > 0 && Math.random() < 0.25) {
        commentText = this.currentAcceptableAnswers[0];
      } else {
        commentText = randomFillerComments[Math.floor(Math.random() * randomFillerComments.length)];
      }

      const comment: TikTokLiveComment = {
        id: `tt-sim-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        userId: user.username,
        username: `@${user.username}`,
        displayName: user.name,
        avatarUrl: user.avatar,
        comment: commentText,
        timestamp: Date.now(),
      };

      this.processComment(comment);
    }, 1800);
  }

  public stopSimulation(): void {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
  }

  public getLeaderboard(): PlayerScore[] {
    const list = Array.from(this.leaderboard.values());
    return list.sort((a, b) => b.score - a.score);
  }

  public resetLeaderboard(): void {
    this.leaderboard.clear();
    this.answeredUserIdsThisQuestion.clear();
    this.correctAnswerCountThisQuestion = 0;
    this.roundWinnerDeclared = false;
    this.persistLeaderboard();
  }

  private updateRanks(): void {
    const sorted = Array.from(this.leaderboard.values()).sort((a, b) => b.score - a.score);
    sorted.forEach((player, idx) => {
      player.rank = idx + 1;
      if (idx === 0) player.badge = '🥇 المركز الأول';
      else if (idx === 1) player.badge = '🥈 المركز الثاني';
      else if (idx === 2) player.badge = '🥉 المركز الثالث';
      else player.badge = undefined;
    });
  }
}

export const tiktokEngine = new TikTokLiveEngine();
