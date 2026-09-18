import type {
  AEPRealtimeEvent,
  AEPChatPayload,
  AEPGiftPayload,
  AEPLikePayload,
  AEPFollowPayload,
  AEPSharePayload,
  AEPViewerUpdatePayload,
  AEPRoomUpdatePayload,
} from './types';

export class EventNormalizer {
  /**
   * Normalizes Arabic text:
   * - Strips diacritics (tashkeel: fatha, damma, kasra, sukun, shadda, tanwin)
   * - Converts Eastern Arabic digits (٠-٩) to standard ASCII (0-9)
   * - Normalizes Alif variants (أ, إ, آ, ٱ) to bare Alif (ا)
   * - Normalizes Tah Marbutah (ة) to (ه)
   * - Normalizes Alif Maqsura (ى) to (ي)
   * - Trims and cleans whitespace
   */
  public static normalizeArabicText(text: string): string {
    if (!text) return '';

    let s = text.trim();

    // 1. Remove Arabic Tashkeel / Harakat (diacritics)
    s = s.replace(/[\u064B-\u0652\u0670]/g, '');

    // 2. Remove Tatweel / Kashida
    s = s.replace(/\u0640/g, '');

    // 3. Convert Eastern Arabic-Indic numerals (٠-٩) to ASCII
    const easternDigits: Record<string, string> = {
      '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
      '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9',
    };
    s = s.replace(/[٠-٩]/g, (digit) => easternDigits[digit] || digit);

    // 4. Normalize Alifs
    s = s.replace(/[أإآٱ]/g, 'ا');

    // 5. Normalize Tah Marbutah
    s = s.replace(/ة/g, 'ه');

    // 6. Normalize Alif Maqsura
    s = s.replace(/ى/g, 'ي');

    // 7. Collapse multiple spaces
    s = s.replace(/\s+/g, ' ');

    return s.trim();
  }

  /**
   * Safe avatar URL with fallback
   */
  public static extractAvatarUrl(data: any): string {
    const userObj = data?.user || {};
    return (
      data?.profilePictureUrl ||
      userObj?.avatarThumb?.urlList?.[0] ||
      userObj?.avatarMedium?.urlList?.[0] ||
      userObj?.avatarLarge?.urlList?.[0] ||
      data?.avatarThumb ||
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80'
    );
  }

  /**
   * Normalizes raw chat event
   */
  public static normalizeChat(
    data: any,
    broadcasterUsername: string,
    roomId?: string
  ): Omit<AEPRealtimeEvent<AEPChatPayload>, 'seq'> {
    const userObj = data?.user || {};
    const rawUniqueId =
      data?.uniqueId ||
      userObj?.uniqueId ||
      userObj?.displayId ||
      userObj?.idStr ||
      '';
    const cleanUniqueId = rawUniqueId
      ? `@${rawUniqueId.replace(/^@/, '')}`
      : '@anonymous';
    const nickname = data?.nickname || userObj?.nickname || cleanUniqueId;
    const rawComment = String(data?.comment || data?.content || '').trim();
    const normalizedComment = this.normalizeArabicText(rawComment);
    const userId = String(userObj?.userId || userObj?.id || rawUniqueId || `user-${Date.now()}`);

    const userBadges: string[] = [];
    if (data?.isModerator || userObj?.isModerator) userBadges.push('MODERATOR');
    if (data?.isSubscriber || userObj?.isSubscriber) userBadges.push('SUBSCRIBER');

    const eventId = data?.msgId || data?.id || `chat-${userId}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    return {
      id: String(eventId),
      type: 'chat',
      timestamp: Number(data?.createTime) ? Number(data.createTime) * 1000 : Date.now(),
      broadcasterUsername,
      roomId,
      payload: {
        userId,
        uniqueId: cleanUniqueId,
        nickname,
        comment: rawComment,
        normalizedComment,
        avatarUrl: this.extractAvatarUrl(data),
        isModerator: !!(data?.isModerator || userObj?.isModerator),
        isSubscriber: !!(data?.isSubscriber || userObj?.isSubscriber),
        followRole: data?.followRole ?? userObj?.followRole,
        userBadges,
        timestamp: Date.now(),
      },
    };
  }

  /**
   * Normalizes raw gift event
   */
  public static normalizeGift(
    data: any,
    broadcasterUsername: string,
    roomId?: string
  ): Omit<AEPRealtimeEvent<AEPGiftPayload>, 'seq'> {
    const userObj = data?.user || {};
    const rawUniqueId = data?.uniqueId || userObj?.uniqueId || userObj?.displayId || '';
    const cleanUniqueId = rawUniqueId ? `@${rawUniqueId.replace(/^@/, '')}` : '@anonymous';
    const nickname = data?.nickname || userObj?.nickname || cleanUniqueId;
    const userId = String(userObj?.userId || userObj?.id || rawUniqueId || `user-${Date.now()}`);

    const diamondCount = Number(data?.diamondCount) || 1;
    const repeatCount = Number(data?.repeatCount) || 1;
    const comboCount = Number(data?.comboCount) || repeatCount;
    const totalDiamonds = diamondCount * repeatCount;

    const eventId = data?.msgId || `gift-${userId}-${data?.giftId || 'g'}-${Date.now()}-${repeatCount}`;

    return {
      id: String(eventId),
      type: 'gift',
      timestamp: Number(data?.createTime) ? Number(data.createTime) * 1000 : Date.now(),
      broadcasterUsername,
      roomId,
      payload: {
        userId,
        uniqueId: cleanUniqueId,
        nickname,
        avatarUrl: this.extractAvatarUrl(data),
        giftId: data?.giftId || 'unknown',
        giftName: data?.giftName || 'هدية',
        giftPictureUrl: data?.giftPictureUrl || data?.giftDetails?.giftImage?.urlList?.[0],
        diamondCount,
        repeatCount,
        comboCount,
        totalDiamonds,
        timestamp: Date.now(),
      },
    };
  }

  /**
   * Normalizes raw like event
   */
  public static normalizeLike(
    data: any,
    broadcasterUsername: string,
    roomId?: string
  ): Omit<AEPRealtimeEvent<AEPLikePayload>, 'seq'> {
    const userObj = data?.user || {};
    const rawUniqueId = data?.uniqueId || userObj?.uniqueId || userObj?.displayId || '';
    const cleanUniqueId = rawUniqueId ? `@${rawUniqueId.replace(/^@/, '')}` : '@anonymous';
    const nickname = data?.nickname || userObj?.nickname || cleanUniqueId;
    const userId = String(userObj?.userId || userObj?.id || rawUniqueId || `user-${Date.now()}`);

    const likeCount = Number(data?.likeCount) || 1;
    const totalLikes = Number(data?.totalLikeCount) || likeCount;

    const eventId = data?.msgId || `like-${userId}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    return {
      id: String(eventId),
      type: 'like',
      timestamp: Date.now(),
      broadcasterUsername,
      roomId,
      payload: {
        userId,
        uniqueId: cleanUniqueId,
        nickname,
        avatarUrl: this.extractAvatarUrl(data),
        likeCount,
        totalLikes,
        timestamp: Date.now(),
      },
    };
  }

  /**
   * Normalizes follow event
   */
  public static normalizeFollow(
    data: any,
    broadcasterUsername: string,
    roomId?: string
  ): Omit<AEPRealtimeEvent<AEPFollowPayload>, 'seq'> {
    const userObj = data?.user || {};
    const rawUniqueId = data?.uniqueId || userObj?.uniqueId || userObj?.displayId || '';
    const cleanUniqueId = rawUniqueId ? `@${rawUniqueId.replace(/^@/, '')}` : '@anonymous';
    const nickname = data?.nickname || userObj?.nickname || cleanUniqueId;
    const userId = String(userObj?.userId || userObj?.id || rawUniqueId || `user-${Date.now()}`);

    const eventId = data?.msgId || `follow-${userId}-${Date.now()}`;

    return {
      id: String(eventId),
      type: 'follow',
      timestamp: Date.now(),
      broadcasterUsername,
      roomId,
      payload: {
        userId,
        uniqueId: cleanUniqueId,
        nickname,
        avatarUrl: this.extractAvatarUrl(data),
        timestamp: Date.now(),
      },
    };
  }

  /**
   * Normalizes share event
   */
  public static normalizeShare(
    data: any,
    broadcasterUsername: string,
    roomId?: string
  ): Omit<AEPRealtimeEvent<AEPSharePayload>, 'seq'> {
    const userObj = data?.user || {};
    const rawUniqueId = data?.uniqueId || userObj?.uniqueId || userObj?.displayId || '';
    const cleanUniqueId = rawUniqueId ? `@${rawUniqueId.replace(/^@/, '')}` : '@anonymous';
    const nickname = data?.nickname || userObj?.nickname || cleanUniqueId;
    const userId = String(userObj?.userId || userObj?.id || rawUniqueId || `user-${Date.now()}`);

    const eventId = data?.msgId || `share-${userId}-${Date.now()}`;

    return {
      id: String(eventId),
      type: 'share',
      timestamp: Date.now(),
      broadcasterUsername,
      roomId,
      payload: {
        userId,
        uniqueId: cleanUniqueId,
        nickname,
        avatarUrl: this.extractAvatarUrl(data),
        timestamp: Date.now(),
      },
    };
  }

  /**
   * Normalizes viewer update event
   */
  public static normalizeViewerUpdate(
    viewerCount: number,
    broadcasterUsername: string,
    roomId?: string
  ): Omit<AEPRealtimeEvent<AEPViewerUpdatePayload>, 'seq'> {
    return {
      id: `viewers-${Date.now()}`,
      type: 'viewer_update',
      timestamp: Date.now(),
      broadcasterUsername,
      roomId,
      payload: {
        viewerCount: Math.max(0, viewerCount),
        timestamp: Date.now(),
      },
    };
  }

  /**
   * Normalizes room update event
   */
  public static normalizeRoomUpdate(
    roomData: Partial<AEPRoomUpdatePayload>,
    broadcasterUsername: string,
    roomId?: string
  ): Omit<AEPRealtimeEvent<AEPRoomUpdatePayload>, 'seq'> {
    return {
      id: `room-${Date.now()}`,
      type: 'room_update',
      timestamp: Date.now(),
      broadcasterUsername,
      roomId: roomId || roomData.roomId || '',
      payload: {
        roomId: roomId || roomData.roomId || '',
        title: roomData.title || '',
        broadcasterUsername,
        viewerCount: roomData.viewerCount || 0,
        totalLikes: roomData.totalLikes || 0,
        isLive: roomData.isLive ?? true,
        coverUrl: roomData.coverUrl,
        timestamp: Date.now(),
      },
    };
  }
}
