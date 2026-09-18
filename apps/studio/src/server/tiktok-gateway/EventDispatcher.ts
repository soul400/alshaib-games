import type { AEPEventType, AEPRealtimeEvent, EventSubscriber } from './types';

interface Subscription {
  id: string;
  filter: AEPEventType | '*';
  callback: EventSubscriber;
}

export class EventDispatcher {
  private subscriptions: Map<string, Subscription> = new Map();
  private subIdCounter = 0;

  public subscribe(
    filter: AEPEventType | '*',
    callback: EventSubscriber
  ): () => void {
    const id = `sub-${++this.subIdCounter}-${Date.now()}`;
    this.subscriptions.set(id, { id, filter, callback });

    return () => {
      this.subscriptions.delete(id);
    };
  }

  public dispatch(event: AEPRealtimeEvent): void {
    for (const sub of this.subscriptions.values()) {
      if (sub.filter === '*' || sub.filter === event.type) {
        try {
          sub.callback(event);
        } catch (err) {
          console.warn(`[EventDispatcher] Error in subscriber ${sub.id}:`, err);
        }
      }
    }
  }

  public subscriberCount(): number {
    return this.subscriptions.size;
  }

  public clear(): void {
    this.subscriptions.clear();
  }
}
