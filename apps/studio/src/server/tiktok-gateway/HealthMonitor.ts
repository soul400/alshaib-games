import type { TikTokConnectionState, AEPGatewayHealthMetrics } from './types';

export class HealthMonitor {
  private startedAt: number = Date.now();
  private totalEventsReceived: number = 0;
  private totalEventsEmitted: number = 0;
  private reconnectAttempts: number = 0;
  private recentTimestamps: number[] = [];

  public recordReceived(): void {
    this.totalEventsReceived++;
    const now = Date.now();
    this.recentTimestamps.push(now);

    // Keep only last 5 seconds of timestamps for calculating eventsPerSecond
    const cutoff = now - 5000;
    while (this.recentTimestamps.length > 0 && this.recentTimestamps[0] < cutoff) {
      this.recentTimestamps.shift();
    }
  }

  public recordEmitted(): void {
    this.totalEventsEmitted++;
  }

  public recordReconnectAttempt(): void {
    this.reconnectAttempts++;
  }

  public resetReconnectAttempts(): void {
    this.reconnectAttempts = 0;
  }

  public getEventsPerSecond(): number {
    const now = Date.now();
    const cutoff = now - 5000;
    while (this.recentTimestamps.length > 0 && this.recentTimestamps[0] < cutoff) {
      this.recentTimestamps.shift();
    }
    return Math.round((this.recentTimestamps.length / 5) * 10) / 10;
  }

  public getMetrics(params: {
    status: TikTokConnectionState;
    broadcasterUsername: string;
    roomId?: string;
    activeSubscribers: number;
    lastEventTimestamp: number;
    stalenessThresholdMs: number;
    bufferSize: number;
    dedupCacheSize: number;
  }): AEPGatewayHealthMetrics {
    const now = Date.now();
    const lastEventAgeMs = Math.max(0, now - params.lastEventTimestamp);
    const stalenessWarning =
      params.status === 'STREAMING' && lastEventAgeMs > params.stalenessThresholdMs;

    let memoryUsageMb = 0;
    if (typeof process !== 'undefined' && process.memoryUsage) {
      memoryUsageMb = Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 10) / 10;
    }

    return {
      status: params.status,
      broadcasterUsername: params.broadcasterUsername,
      roomId: params.roomId,
      isOnline: params.status === 'CONNECTED' || params.status === 'STREAMING',
      uptimeSeconds: Math.floor((now - this.startedAt) / 1000),
      reconnectAttempts: this.reconnectAttempts,
      totalEventsReceived: this.totalEventsReceived,
      totalEventsEmitted: this.totalEventsEmitted,
      eventsPerSecond: this.getEventsPerSecond(),
      activeSubscribers: params.activeSubscribers,
      lastEventTimestamp: params.lastEventTimestamp,
      lastEventAgeMs,
      stalenessWarning,
      bufferSize: params.bufferSize,
      dedupCacheSize: params.dedupCacheSize,
      memoryUsageMb,
      startedAt: this.startedAt,
    };
  }

  public reset(): void {
    this.startedAt = Date.now();
    this.totalEventsReceived = 0;
    this.totalEventsEmitted = 0;
    this.reconnectAttempts = 0;
    this.recentTimestamps = [];
  }
}
