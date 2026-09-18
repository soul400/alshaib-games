export class HeartbeatMonitor {
  private pingIntervalTimer: NodeJS.Timeout | null = null;
  private stalenessCheckTimer: NodeJS.Timeout | null = null;
  private readonly pingIntervalMs: number;
  private readonly stalenessThresholdMs: number;
  private lastEventAt: number = Date.now();
  private onPingCallback?: () => void;
  private onStaleCallback?: (ageMs: number) => void;

  constructor(
    pingIntervalMs: number = 10000,
    stalenessThresholdMs: number = 120000
  ) {
    this.pingIntervalMs = pingIntervalMs;
    this.stalenessThresholdMs = stalenessThresholdMs;
  }

  public start(
    onPing: () => void,
    onStale: (ageMs: number) => void
  ): void {
    this.stop();
    this.onPingCallback = onPing;
    this.onStaleCallback = onStale;
    this.recordActivity();

    this.pingIntervalTimer = setInterval(() => {
      if (this.onPingCallback) {
        this.onPingCallback();
      }
    }, this.pingIntervalMs);

    this.stalenessCheckTimer = setInterval(() => {
      const ageMs = Date.now() - this.lastEventAt;
      if (ageMs > this.stalenessThresholdMs && this.onStaleCallback) {
        this.onStaleCallback(ageMs);
      }
    }, 15000);

    if (this.pingIntervalTimer.unref) this.pingIntervalTimer.unref();
    if (this.stalenessCheckTimer.unref) this.stalenessCheckTimer.unref();
  }

  public recordActivity(): void {
    this.lastEventAt = Date.now();
  }

  public getLastEventAt(): number {
    return this.lastEventAt;
  }

  public getLastEventAgeMs(): number {
    return Date.now() - this.lastEventAt;
  }

  public isStale(): boolean {
    return this.getLastEventAgeMs() > this.stalenessThresholdMs;
  }

  public stop(): void {
    if (this.pingIntervalTimer) {
      clearInterval(this.pingIntervalTimer);
      this.pingIntervalTimer = null;
    }
    if (this.stalenessCheckTimer) {
      clearInterval(this.stalenessCheckTimer);
      this.stalenessCheckTimer = null;
    }
  }
}
