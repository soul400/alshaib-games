import { PlayerScore, TikTokLiveComment, WinnerAnnouncement } from '@aep/types';
import { isAnswerMatch } from '@aep/game-engines';

export type TikTokCommentCallback = (comment: TikTokLiveComment) => void;
export type WinnerCallback = (winner: WinnerAnnouncement) => void;
export type StreamStatusCallback = (status: LiveRoomStatus) => void;
export type CorrectAnswerCallback = (data: { player: PlayerScore; pointsEarned: number; rank: number }) => void;

export interface LiveRoomStatus {
  isOnline: boolean;
  username: string;
  roomId?: string;
  title?: string;
  viewerCount?: number;
  avatarUrl?: string;
  statusText: string;
  lastCheckedTime: number;
}

/**
 * TikTok Live Engine - Real WebSocket Connection via SSE API Route
 * 
 * Connects to TikTok Live streams through a Next.js server-side SSE endpoint
 * that uses tiktok-live-connector (Node.js WebSocket) under the hood.
 * 
 * Architecture:
 *   Browser → EventSource(/api/tiktok-live/stream?username=X) → Next.js API Route → TikTok Webcast
 */
export class TikTokLiveEngine {
  private isConnected: boolean = false;
  private channelName: string = '';
  private roomStatus: LiveRoomStatus = {
    isOnline: false,
    username: '',
    statusText: 'غير متصل (Offline)',
    lastCheckedTime: Date.now()
  };

  private commentListeners: Set<TikTokCommentCallback> = new Set();
  private winnerListeners: Set<WinnerCallback> = new Set();
  private statusListeners: Set<StreamStatusCallback> = new Set();
  private correctAnswerListeners: Set<CorrectAnswerCallback> = new Set();
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
            list.forEach(p => {
              if (p && p.userId) {
                this.leaderboard.set(p.userId, p);
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
   * Award points directly to a player (e.g. from WhatDoTheySay, Roulette, The Vault) and persist immediately
   */
  public awardPoints(playerInfo: { userId: string; username: string; displayName?: string; avatarUrl?: string; points: number }): PlayerScore {
    let player = this.leaderboard.get(playerInfo.userId);
    if (!player) {
      player = {
        userId: playerInfo.userId,
        username: playerInfo.username,
        displayName: playerInfo.displayName || playerInfo.username,
        avatarUrl: playerInfo.avatarUrl || '',
        score: 0,
        correctAnswersCount: 0,
        rank: this.leaderboard.size + 1
      };
    }

    player.score += playerInfo.points;
    player.correctAnswersCount += 1;
    this.leaderboard.set(playerInfo.userId, player);
    this.updateRanks();
    this.persistLeaderboard();

    this.correctAnswerListeners.forEach(cb => cb({ player: { ...player! }, pointsEarned: playerInfo.points, rank: player!.rank }));

    return { ...player };
  }

  /**
   * Connect to TikTok Live Stream via SSE API Route (Real Connection)
   */
  public async connect(channelName: string): Promise<LiveRoomStatus> {
    const cleanUsername = channelName.trim().replace(/^@/, '');

    // Reuse existing active connection if already connected to this channel
    if (this.isConnected && this.channelName === cleanUsername && this.eventSource && this.eventSource.readyState !== EventSource.CLOSED) {
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
      lastCheckedTime: Date.now()
    };
    this.statusListeners.forEach(cb => cb(this.roomStatus));

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
            lastCheckedTime: Date.now()
          };
          this.statusListeners.forEach(cb => cb(this.roomStatus));
          
          // Resolve promise on first definitive status
          if (data.type === 'live' || data.type === 'connected' || data.type === 'offline' || data.type === 'ended' || data.type === 'disconnected' || data.type === 'error') {
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
            userId: data.userId,
            username: data.username,
            displayName: data.displayName,
            avatarUrl: data.avatarUrl || '',
            comment: data.comment,
            timestamp: data.timestamp || Date.now()
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
          this.roomStatus.viewerCount = data.viewerCount;
          this.roomStatus.lastCheckedTime = Date.now();
          this.statusListeners.forEach(cb => cb(this.roomStatus));
        } catch (e) {}
      });

      // Listen for errors
      this.eventSource.addEventListener('error', (event) => {
        // If it's a MessageEvent with data (custom error), parse it
        if (event instanceof MessageEvent && event.data) {
          try {
            const data = JSON.parse(event.data);
            console.warn('TikTok Live SSE error:', data.message);
            this.roomStatus = {
              isOnline: false,
              username: cleanUsername,
              statusText: `🔴 خطأ: ${data.message}`,
              lastCheckedTime: Date.now()
            };
            this.statusListeners.forEach(cb => cb(this.roomStatus));
            resolveOnce(this.roomStatus);
          } catch (_) {}
        }
      });

      // Handle EventSource connection errors (e.g., server down or temporary stream drop)
      this.eventSource.onerror = (e: Event) => {
        if (e) {
          try {
            if (typeof (e as any).preventDefault === 'function') (e as any).preventDefault();
            if (typeof (e as any).stopPropagation === 'function') (e as any).stopPropagation();
            if (typeof (e as any).stopImmediatePropagation === 'function') (e as any).stopImmediatePropagation();
          } catch (_) {}
        }
        this.roomStatus = {
          isOnline: false,
          username: cleanUsername,
          statusText: '🔴 أوفلاين (البث غير متصل)',
          lastCheckedTime: Date.now()
        };
        this.isConnected = false;
        this.statusListeners.forEach(cb => cb(this.roomStatus));
        resolveOnce(this.roomStatus);

        if (this.eventSource) {
          try {
            this.eventSource.close();
            this.eventSource = null;
          } catch (_) {}
        }

        // Auto-reconnect after 8 seconds cleanly
        if (this.channelName) {
          if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
          this.reconnectTimeout = setTimeout(() => {
            if (!this.isConnected && this.channelName) {
              this.connect(this.channelName).catch(() => {});
            }
          }, 8000);
        }
      };

      // Timeout: resolve if no response within 15 seconds
      setTimeout(() => {
        if (!resolved) {
          this.roomStatus = {
            isOnline: false,
            username: cleanUsername,
            statusText: '🔴 انتهت مهلة الاتصال - تأكد أن البث نشط',
            lastCheckedTime: Date.now()
          };
          this.statusListeners.forEach(cb => cb(this.roomStatus));
          resolveOnce(this.roomStatus);
        }
      }, 15000);
    });
  }

  /**
   * Check real live status (uses the SSE connect internally)
   */
  public async checkRealLiveStatus(username: string): Promise<LiveRoomStatus> {
    return this.connect(username);
  }

  /**
   * Generates Direct Web Play Link for running directly on the website
   */
  public getDirectWebPlayUrl(baseUrl: string = 'http://localhost:3020'): string {
    return `${baseUrl}/play?channel=${encodeURIComponent(this.channelName)}`;
  }

  /**
   * Disconnect from TikTok Live Stream
   */
  public disconnect(): void {
    this.isConnected = false;
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.eventSource) {
      this.eventSource.close();
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

  /**
   * Set the active question and engine type for scoring
   * Resets per-question user deduplication map
   */
  public setActiveQuestion(questionTitle: string, acceptableAnswers: string[], points: number, engineType: string = 'quiz'): void {
    this.currentQuestionTitle = questionTitle;
    this.currentAcceptableAnswers = acceptableAnswers;
    this.currentQuestionPoints = points;
    this.currentEngineType = engineType;
    this.roundWinnerDeclared = false;
    this.correctAnswerCountThisQuestion = 0;
    this.answeredUserIdsThisQuestion = new Set();
    this.isAcceptingAnswers = true; // Re-open answers for new question
  }

  /**
   * Control whether the engine accepts and scores answers.
   * Call with false when timer expires or answer is revealed.
   */
  public setAcceptingAnswers(accepting: boolean): void {
    this.isAcceptingAnswers = accepting;
  }

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

  public getComments(): TikTokLiveComment[] {
    return [...this.liveCommentsList];
  }

  /**
   * Calculate points based on engine type and answer order:
   * - alphabet: Only 1st answer gets 1 point, then roundWinnerDeclared = true
   * - all others: 1st=5, 2nd=4, 3rd=3, 4th=2, 5th=1, after 5th=0 (no more points)
   */
  private calculatePoints(answerOrder: number): number {
    if (this.currentEngineType === 'alphabet') {
      return answerOrder === 1 ? 1 : 0;
    }
    const pointsMap: Record<number, number> = { 1: 5, 2: 4, 3: 3, 4: 2, 5: 1 };
    return pointsMap[answerOrder] || 0;
  }

  public processComment(comment: TikTokLiveComment): void {
    // Automatically set isConnected to true when receiving live comments
    this.isConnected = true;

    // Store in global engine comments list
    this.liveCommentsList = [comment, ...this.liveCommentsList.slice(0, 99)];

    this.commentListeners.forEach(cb => cb(comment));

    // Standalone Interactive Engines (hunter-roulette, mystery-roulette, musical-chairs, the-vault, bomb-pass, react, what-do-they-say, memory-match) manage their own scoring & flow
    if (this.currentEngineType === 'hunter-roulette' || this.currentEngineType === 'mystery-roulette' || this.currentEngineType === 'musical-chairs' || this.currentEngineType === 'the-vault' || this.currentEngineType === 'bomb-pass' || this.currentEngineType === 'react' || this.currentEngineType === 'what-do-they-say' || this.currentEngineType === 'memory-match') {
      return;
    }

    if (this.currentAcceptableAnswers.length > 0 && this.isAcceptingAnswers) {
      if (isAnswerMatch(comment.comment, this.currentAcceptableAnswers)) {
        const userKey = String(comment.userId || comment.username || '').toLowerCase().trim();
        const usernameKey = String(comment.username || '').toLowerCase().trim();

        if (this.answeredUserIdsThisQuestion.has(userKey) || (usernameKey && this.answeredUserIdsThisQuestion.has(usernameKey))) {
          return; // Already scored on this question
        }
        this.answeredUserIdsThisQuestion.add(userKey);
        if (usernameKey) this.answeredUserIdsThisQuestion.add(usernameKey);

        this.correctAnswerCountThisQuestion += 1;
        const answerOrder = this.correctAnswerCountThisQuestion;

        const pointsEarned = this.calculatePoints(answerOrder);

        if (this.currentEngineType === 'alphabet' && answerOrder > 1) return;
        if (this.currentEngineType !== 'alphabet' && answerOrder > 5) return;

        if (pointsEarned > 0) {
          let player = this.leaderboard.get(comment.userId);
          if (!player) {
            player = {
              id: comment.userId,
              username: comment.username,
              displayName: comment.displayName,
              avatarUrl: comment.avatarUrl,
              score: 0,
              correctAnswersCount: 0,
              rank: this.leaderboard.size + 1
            };
          }

          player.score += pointsEarned;
          player.correctAnswersCount += 1;
          player.lastCorrectAnswer = comment.comment;
          this.leaderboard.set(comment.userId, player);
          this.updateRanks();
          this.persistLeaderboard();

          this.correctAnswerListeners.forEach(cb => cb({ player: { ...player! }, pointsEarned, rank: answerOrder }));
        }

        if (answerOrder === 1) {
          this.roundWinnerDeclared = true;

          const player = this.leaderboard.get(comment.userId)!;
          const winnerAnnouncement: WinnerAnnouncement = {
            player: { ...player },
            questionTitle: this.currentQuestionTitle,
            correctAnswer: this.currentAcceptableAnswers[0],
            pointsEarned,
            timestamp: Date.now()
          };

          this.winnerListeners.forEach(cb => cb(winnerAnnouncement));
        }

        if (this.currentEngineType === 'alphabet') {
          return;
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
      { username: 'king_quiz', name: 'محمد الدوسري', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80' }
    ];

    const randomFillerComments = [
      'مستعدين!!', 'منور البث يا غالي', 'يا رب أفوز اليوم 🔥', 'سؤال صعب شوي',
      'كفوو المذيع 🔥🔥', 'تحية من الرياض ✨', 'أنا أعرف الإجابة'
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
        id: `tt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        userId: user.username,
        username: `@${user.username}`,
        displayName: user.name,
        avatarUrl: user.avatar,
        comment: commentText,
        timestamp: Date.now()
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
