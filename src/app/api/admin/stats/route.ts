import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const [pending, totalReviewed, verifiedThreats, falsePositives, approvedSafe, escalated, totalScans] = await Promise.all([
      prisma.scan.count({ where: { approvalStatus: 'NEEDS_REVIEW' } }),
      prisma.scanReview.count(),
      prisma.scanReview.count({ where: { decision: 'VERIFIED_THREAT' } }),
      prisma.scanReview.count({ where: { decision: 'FALSE_POSITIVE' } }),
      prisma.scanReview.count({ where: { decision: 'APPROVED_SAFE' } }),
      prisma.scanReview.count({ where: { decision: 'ESCALATED' } }),
      prisma.scan.count(),
    ]);

    const verifiedThreatRate = totalReviewed > 0 ? Math.round((verifiedThreats / totalReviewed) * 100) : 0;
    const falsePositiveRate = totalReviewed > 0 ? Math.round((falsePositives / totalReviewed) * 100) : 0;

    // Recent reviews
    const recentReviews = await prisma.scanReview.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        reviewer: { select: { name: true, email: true } },
        scan: { select: { type: true, originalInput: true, riskScore: true, riskLevel: true } },
      }
    });

    return NextResponse.json({
      stats: {
        pending,
        totalReviewed,
        verifiedThreats,
        falsePositives,
        approvedSafe,
        escalated,
        verifiedThreatRate,
        falsePositiveRate,
        totalScans,
      },
      recentReviews,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 });
  }
}
