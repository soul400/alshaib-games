import { NextRequest } from 'next/server';
import { TikTokConnectionManager } from '@/server/tiktok-gateway';
import type { AEPRealtimeEvent } from '@/server/tiktok-gateway';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

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

  const manager = TikTokConnectionManager.getInstance();

  // Trigger background connect if not already connected
  manager.connect(username).catch((err) => {
    console.warn('[SSE Route] Background connect error:', err.message);
  });

  const encoder = new TextEncoder();
  let unsubscribe: (() => void) | null = null;
  let keepAliveTimer: NodeJS.Timeout | null = null;
  let isStreamClosed = false;

  const stream = new ReadableStream({
    start(controller) {
      // Periodic HTTP keep-alive ping to prevent Vercel/proxy idle timeout
      keepAliveTimer = setInterval(() => {
        if (isStreamClosed) return;
        try {
          controller.enqueue(encoder.encode(`: keepalive ${Date.now()}\n\n`));
        } catch (_) {
          isStreamClosed = true;
          if (keepAliveTimer) clearInterval(keepAliveTimer);
          if (unsubscribe) unsubscribe();
        }
      }, 4000);

      // Helper to enqueue SSE formatted message
      const sendRaw = (eventName: string, data: any) => {
        if (isStreamClosed) return;
        try {
          controller.enqueue(
            encoder.encode(`event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`)
          );
        } catch (_) {
          isStreamClosed = true;
          if (keepAliveTimer) clearInterval(keepAliveTimer);
          if (unsubscribe) unsubscribe();
        }
      };

      // Helper to map normalized events to both unified and legacy events
      const handleEvent = (event: AEPRealtimeEvent) => {
        if (isStreamClosed) return;

        // 1. Send the unified normalized event
        sendRaw('aep_event', event);

        // 2. Send legacy event format for backward compatibility with existing components
        switch (event.type) {
          case 'chat':
            sendRaw('comment', {
              id: event.id,
              userId: event.payload.userId,
              username: event.payload.uniqueId,
              displayName: event.payload.nickname,
              avatarUrl: event.payload.avatarUrl,
              comment: event.payload.comment,
              timestamp: event.timestamp,
            });
            break;

          case 'gift':
            sendRaw('gift', {
              id: event.id,
              userId: event.payload.userId,
              username: event.payload.uniqueId,
              displayName: event.payload.nickname,
              avatarUrl: event.payload.avatarUrl,
              giftName: event.payload.giftName,
              diamondCount: event.payload.diamondCount,
              repeatCount: event.payload.repeatCount,
              totalDiamonds: event.payload.totalDiamonds,
              timestamp: event.timestamp,
            });
            break;

          case 'viewer_update':
            sendRaw('roomInfo', {
              viewerCount: event.payload.viewerCount,
              timestamp: event.timestamp,
            });
            break;

          case 'connection_state':
            sendRaw('status', {
              type: event.payload.currentState.toLowerCase(),
              username: event.payload.broadcasterUsername,
              roomId: event.payload.roomId,
              isOnline:
                event.payload.currentState === 'CONNECTED' ||
                event.payload.currentState === 'STREAMING',
              message: event.payload.message,
              timestamp: event.timestamp,
            });
            break;

          case 'room_update':
            sendRaw('roomInfo', {
              roomId: event.payload.roomId,
              viewerCount: event.payload.viewerCount,
              totalLikes: event.payload.totalLikes,
              isLive: event.payload.isLive,
              timestamp: event.timestamp,
            });
            break;
        }
      };

      // Subscribe to event dispatcher (Fanout)
      unsubscribe = manager.subscribe('*', handleEvent);

      // Send initial status immediately so client knows current state
      const health = manager.getHealth();
      sendRaw('status', {
        type: health.status.toLowerCase(),
        username: health.broadcasterUsername || username,
        roomId: health.roomId,
        isOnline: health.isOnline,
        message: health.isOnline
          ? `🟢 متصل ببث @${health.broadcasterUsername}`
          : `⏳ حالة الاتصال: ${health.status}`,
        timestamp: Date.now(),
      });

      // Hydrate with recent 25 events from buffer
      const recent = manager.getRecentEvents(25);
      for (const ev of recent) {
        handleEvent(ev);
      }

      // Handle client disconnect (abort signal)
      // IMPORTANT: Does NOT disconnect the upstream TikTok session! Only removes this tab's subscriber.
      request.signal.addEventListener('abort', () => {
        isStreamClosed = true;
        if (keepAliveTimer) {
          clearInterval(keepAliveTimer);
          keepAliveTimer = null;
        }
        if (unsubscribe) {
          unsubscribe();
          unsubscribe = null;
        }
        try {
          controller.close();
        } catch (_) {}
      });
    },

    cancel() {
      isStreamClosed = true;
      if (keepAliveTimer) {
        clearInterval(keepAliveTimer);
        keepAliveTimer = null;
      }
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }
    },
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
