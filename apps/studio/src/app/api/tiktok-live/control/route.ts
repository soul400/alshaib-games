import { NextRequest, NextResponse } from 'next/server';
import { TikTokConnectionManager } from '@/server/tiktok-gateway';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, username } = body;

    const manager = TikTokConnectionManager.getInstance();

    switch (action) {
      case 'reconnect':
        await manager.forceReconnect();
        return NextResponse.json({
          success: true,
          message: 'جاري إعادة الاتصال...',
          health: manager.getHealth(),
        });

      case 'disconnect':
        manager.disconnect();
        return NextResponse.json({
          success: true,
          message: 'تم إيقاف الاتصال',
          health: manager.getHealth(),
        });

      case 'connect':
        if (username) {
          await manager.connect(username);
        } else {
          await manager.connect();
        }
        return NextResponse.json({
          success: true,
          message: 'جاري الاتصال...',
          health: manager.getHealth(),
        });

      default:
        return NextResponse.json(
          { success: false, error: 'إجراء غير صالح (Invalid action)' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'فشلت معالجة الطلب',
      },
      { status: 500 }
    );
  }
}
