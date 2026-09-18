import { NextResponse } from 'next/server';
import { TikTokConnectionManager } from '@/server/tiktok-gateway';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const manager = TikTokConnectionManager.getInstance();
    const metrics = manager.getHealth();

    return NextResponse.json({
      success: true,
      data: metrics,
      timestamp: Date.now(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to retrieve gateway metrics',
      },
      { status: 500 }
    );
  }
}
