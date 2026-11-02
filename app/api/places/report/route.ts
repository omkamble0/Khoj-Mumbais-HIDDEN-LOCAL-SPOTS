import { NextRequest, NextResponse } from 'next/server';
import { PlaceReportPayload } from '@/lib/types';

// In-memory or log store for MVP reports
const reportsLog: (PlaceReportPayload & { timestamp: string })[] = [];

export async function POST(request: NextRequest) {
  try {
    const body: PlaceReportPayload = await request.json();

    if (!body.placeId || !body.reason) {
      return NextResponse.json(
        { error: 'Missing required report fields (placeId, reason)' },
        { status: 400 }
      );
    }

    const report = {
      ...body,
      timestamp: new Date().toISOString(),
    };

    reportsLog.push(report);
    console.log('[SAFETY REPORT RECEIVED]:', report);

    return NextResponse.json({
      status: 'success',
      message: 'Thank you for keeping local discovery safe and legal. Report submitted for review.',
      reportId: `rep_${Date.now()}`,
    });
  } catch (error) {
    console.error('Failed to submit report:', error);
    return NextResponse.json({ error: 'Failed to submit report' }, { status: 500 });
  }
}
