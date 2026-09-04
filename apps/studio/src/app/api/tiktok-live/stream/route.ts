import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

// Global active TikTok connector connections cache to prevent zombie sockets across page refreshes
const globalActiveConnections = new Map<string, { disconnect: () => void; close: () => void }>();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawUsername = searchParams.get('username') || 'soul80813';
  
  // Clean username / channel ID
  let username = rawUsername.trim().replace(/^@/, '');
  if (username === 'sou180813') username = 'soul80813'; // Fix common typo

  if (!username) {
    return new Response(JSON.stringify({ error: 'اسم المستخدم مطلوب' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // If previous connections exist, disconnect them immediately to free sockets
  globalActiveConnections.forEach((conn, key) => {
    try {
      conn.disconnect();
      conn.close();
    } catch (_) {}
    globalActiveConnections.delete(key);
  });

  const encoder = new TextEncoder();
  let cleanupFn: (() => void) | null = null;

  const stream = new ReadableStream({
    async start(controller) {
      let isStreamClosed = false;

      const sendEvent = (event: string, data: any) => {
        if (isStreamClosed) return;
        try {
          controller.enqueue(
            encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
          );
        } catch (_) {
          isStreamClosed = true;
        }
      };

      const sendPing = () => {
        if (isStreamClosed) return;
        try {
          controller.enqueue(encoder.encode(`: ping ${Date.now()}\n\n`));
        } catch (_) {
          isStreamClosed = true;
          if (cleanupFn) cleanupFn();
        }
      };

      // Heartbeat interval every 10 seconds to keep connection alive and detect dropped sockets quickly
      const pingInterval = setInterval(sendPing, 10000);

      try {
        const { TikTokLiveConnection } = await import('tiktok-live-connector');
        
        const tiktokLive = new TikTokLiveConnection(username, {
          processInitialData: true,
          enableExtendedGiftInfo: false,
          requestPollingIntervalMs: 1500,
          clientParams: {
            app_language: 'ar-SA',
            webcast_language: 'ar-SA',
          },
          requestOptions: {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
              'Accept-Language': 'ar-SA,ar;q=0.9,en-US;q=0.8,en;q=0.7',
              'Cache-Control': 'no-cache',
            },
            timeout: 6000,
          }
        });

        // Cleanup handler for this instance
        cleanupFn = () => {
          if (isStreamClosed) return;
          isStreamClosed = true;
          clearInterval(pingInterval);
          globalActiveConnections.delete(username);
          try {
            tiktokLive.disconnect();
          } catch (_) {}
          try {
            controller.close();
          } catch (_) {}
        };

        // Register in active connections
        globalActiveConnections.set(username, {
          disconnect: () => {
            try { tiktokLive.disconnect(); } catch (_) {}
          },
          close: () => {
            isStreamClosed = true;
            clearInterval(pingInterval);
            try { controller.close(); } catch (_) {}
          }
        });

        // Initial connecting notice
        sendEvent('status', {
          type: 'connecting',
          username,
          isOnline: false,
          message: `⏳ جاري الاتصال ببث @${username}...`,
          timestamp: Date.now(),
        });

        // Connection established
        tiktokLive.on('connected', (state: any) => {
          sendEvent('status', {
            type: 'connected',
            username,
            roomId: state?.roomId || tiktokLive.roomId || `room-${Date.now()}`,
            isOnline: true,
            message: `🟢 متصل ببث @${username} بنجاح!`,
            timestamp: Date.now(),
          });
        });

        // Room info & viewer count
        tiktokLive.on('roomUser', (data: any) => {
          const count = data?.viewerCount || data?.userCount || 0;
          sendEvent('roomInfo', {
            viewerCount: count,
            timestamp: Date.now(),
          });
        });

        // Chat / Comments
        tiktokLive.on('chat', (data: any) => {
          const userObj = data?.user || {};
          const commentText = data?.comment || data?.content || '';
          
          const rawUniqueId = data?.uniqueId || userObj?.uniqueId || userObj?.displayId || userObj?.idStr || '';
          const cleanUsername = rawUniqueId ? `@${rawUniqueId}` : '@anonymous';
          const displayName = data?.nickname || userObj?.nickname || cleanUsername;
          
          const avatarUrl = 
            data?.profilePictureUrl || 
            userObj?.avatarThumb?.urlList?.[0] || 
            userObj?.avatarMedium?.urlList?.[0] || 
            userObj?.avatarLarge?.urlList?.[0] || 
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80';

          if (commentText) {
            sendEvent('comment', {
              id: `tt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
              userId: userObj?.userId || rawUniqueId || `user-${Date.now()}`,
              username: cleanUsername,
              displayName: displayName,
              avatarUrl: avatarUrl,
              comment: commentText,
              timestamp: Date.now(),
            });
          }
        });

        // Gifts
        tiktokLive.on('gift', (data: any) => {
          const userObj = data?.user || {};
          const rawUniqueId = data?.uniqueId || userObj?.uniqueId || userObj?.displayId || '';
          sendEvent('gift', {
            userId: userObj?.userId || rawUniqueId,
            username: rawUniqueId ? `@${rawUniqueId}` : '@anonymous',
            displayName: data?.nickname || userObj?.nickname || rawUniqueId,
            giftName: data?.giftName || 'هدية',
            diamondCount: data?.diamondCount || 1,
            repeatCount: data?.repeatCount || 1,
            timestamp: Date.now(),
          });
        });

        // Stream ended
        tiktokLive.on('streamEnd', () => {
          sendEvent('status', {
            type: 'ended',
            username,
            isOnline: false,
            message: `🔴 انتهى بث @${username}`,
            timestamp: Date.now(),
          });
        });

        // Disconnected
        tiktokLive.on('disconnected', () => {
          sendEvent('status', {
            type: 'disconnected',
            username,
            isOnline: false,
            message: `⚠️ انقطع الاتصال ببث @${username}`,
            timestamp: Date.now(),
          });
        });

        // Error handler
        tiktokLive.on('error', (err: any) => {
          sendEvent('status', {
            type: 'error',
            username,
            isOnline: false,
            message: `⚠️ البث غير نشط حالياً لـ @${username}. يمكنك تشغيل "البث التجريبي" للتدريب والإعداد!`,
            timestamp: Date.now(),
          });
        });

        // Connect with a 6-second timeout to prevent hanging
        const connectPromise = tiktokLive.connect();
        const timeoutPromise = new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Connection timeout')), 6000)
        );

        const state: any = await Promise.race([connectPromise, timeoutPromise]);
        
        sendEvent('status', {
          type: 'connected',
          username,
          roomId: state?.roomId || `room-${Date.now()}`,
          isOnline: true,
          message: `🟢 أونلاين - متصل بالبث المباشر (Room: ${state?.roomId})`,
          timestamp: Date.now(),
        });

        // Handle browser client disconnect
        request.signal.addEventListener('abort', () => {
          if (cleanupFn) cleanupFn();
        });

      } catch (err: any) {
        sendEvent('status', {
          type: 'offline',
          username,
          isOnline: false,
          message: `🔴 الحساب @${username} غير متصل ببث كشاف حالياً. اضغط "تشغيل البث التجريبي" لتجربة الألعاب والشات مجاناً!`,
          timestamp: Date.now(),
        });
      }
    },
    cancel(reason) {
      if (cleanupFn) {
        cleanupFn();
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform, no-store',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
