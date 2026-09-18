export class EventDeduplicator {
  private cache: Map<string, number> = new Map();
  private readonly ttlMs: number;
  private readonly maxCapacity: number;
  private cleanupTimer: NodeJS.Timeout | null = null;

  constructor(ttlMs: number = 30000, maxCapacity: number = 10000) {
    this.ttlMs = ttlMs;
    this.maxCapacity = maxCapacity;

    // Periodic sweep every 60s
    if (typeof setInterval !== 'undefined') {
      this.cleanupTimer = setInterval(() => this.cleanup(), 60000);
      if (this.cleanupTimer.unref) {
        this.cleanupTimer.unref();
      }
    }
  }

  /**
   * Check if event ID was already seen within TTL.
   * If not seen, automatically marks it as seen and returns false.
   * If already seen, returns true.
   */
  public isDuplicate(id: string): boolean {
    if (!id) return false;
    const now = Date.now();
    const expiry = this.cache.get(id);

    if (expiry !== undefined && expiry > now) {
      return true;
    }

    // Check capacity before adding
    if (this.cache.size >= this.maxCapacity) {
      this.evictOldest();
    }

    this.cache.set(id, now + this.ttlMs);
    return false;
  }

  /**
   * Remove expired entries
   */
  public cleanup(): void {
    const now = Date.now();
    for (const [id, expiry] of this.cache.entries()) {
      if (expiry <= now) {
        this.cache.delete(id);
      }
    }
  }

  /**
   * Evict the oldest 20% entries when capacity is reached
   */
  private evictOldest(): void {
    this.cleanup();
    if (this.cache.size < this.maxCapacity) return;

    const toDelete = Math.floor(this.maxCapacity * 0.2);
    let count = 0;
    for (const key of this.cache.keys()) {
      this.cache.delete(key);
      count++;
      if (count >= toDelete) break;
    }
  }

  public size(): number {
    return this.cache.size;
  }

  public clear(): void {
    this.cache.clear();
  }

  public destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    this.cache.clear();
  }
}
