import type { AEPRoomUpdatePayload } from './types';

export class TikTokRoomManager {
  private currentUsername: string = '';
  private roomId: string = '';
  private title: string = '';
  private viewerCount: number = 0;
  private totalLikes: number = 0;
  private isLive: boolean = false;
  private coverUrl?: string;

  public setBroadcaster(username: string): void {
    const clean = username.trim().replace(/^@/, '');
    if (clean !== this.currentUsername) {
      this.currentUsername = clean;
      this.reset();
    }
  }

  public getBroadcaster(): string {
    return this.currentUsername;
  }

  public setRoomConnected(roomId: string, title?: string, coverUrl?: string): void {
    this.roomId = roomId;
    if (title) this.title = title;
    if (coverUrl) this.coverUrl = coverUrl;
    this.isLive = true;
  }

  public updateViewerCount(count: number): void {
    this.viewerCount = Math.max(0, count);
  }

  public updateTotalLikes(count: number): void {
    if (count > this.totalLikes) {
      this.totalLikes = count;
    }
  }

  public getRoomInfo(): AEPRoomUpdatePayload {
    return {
      roomId: this.roomId,
      title: this.title,
      broadcasterUsername: this.currentUsername,
      viewerCount: this.viewerCount,
      totalLikes: this.totalLikes,
      isLive: this.isLive,
      coverUrl: this.coverUrl,
      timestamp: Date.now(),
    };
  }

  public reset(): void {
    this.roomId = '';
    this.title = '';
    this.viewerCount = 0;
    this.totalLikes = 0;
    this.isLive = false;
    this.coverUrl = undefined;
  }
}
