import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth/auth';
import { reviewSchema } from '@/lib/validations';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const parsed = reviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Validation failed' },
        { status: 400 }
      );
    }

    const { scanId, decision, notes, finalClassification } = parsed.data;

    // Get original scan
    const scan = await prisma.scan.findUnique({ where: { id: scanId } });
    if (!scan) {
      return NextResponse.json({ error: 'Scan not found' }, { status: 404 });
    }

    // Create review record
    const review = await prisma.scanReview.create({
      data: {
        scanId,
        reviewerId: session.id,
        decision,
        notes: notes || null,
        originalRiskScore: scan.riskScore,
        finalClassification,
      }
    });

    // Update scan approval status
    await prisma.scan.update({
      where: { id: scanId },
      data: {
        approvalStatus: decision,
        needsReview: decision === 'ESCALATED',
        riskLevel: finalClassification,
      }
    });

    return NextResponse.json({
      review,
      message: 'Review submitted successfully'
    });
  } catch (error) {
    console.error('Review error:', error);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}
