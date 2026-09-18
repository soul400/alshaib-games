import type { AEPRealtimeEvent } from './types';

export class EventBuffer {
  private buffer: AEPRealtimeEvent[] = [];
  private readonly capacity: number;

  constructor(capacity: number = 500) {
    this.capacity = capacity;
  }

  public push(event: AEPRealtimeEvent): void {
    if (this.buffer.length >= this.capacity) {
      this.buffer.shift();
    }
    this.buffer.push(event);
  }

  public getRecent(count: number = 50): AEPRealtimeEvent[] {
    const limit = Math.min(count, this.buffer.length);
    return this.buffer.slice(this.buffer.length - limit);
  }

  public getSince(seq: number): AEPRealtimeEvent[] {
    return this.buffer.filter((e) => e.seq > seq);
  }

  public getAll(): AEPRealtimeEvent[] {
    return [...this.buffer];
  }

  public size(): number {
    return this.buffer.length;
  }

  public clear(): void {
    this.buffer = [];
  }
}
