import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'NEEDS_REVIEW';
    const type = searchParams.get('type');
    const riskLevel = searchParams.get('riskLevel');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: Record<string, unknown> = {};
    if (status === 'NEEDS_REVIEW') {
      where.needsReview = true;
      where.approvalStatus = 'NEEDS_REVIEW';
    } else if (status !== 'ALL') {
      where.approvalStatus = status;
    }
    if (type) where.type = type;
    if (riskLevel) where.riskLevel = riskLevel;

    const [scans, total] = await Promise.all([
      prisma.scan.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: { select: { name: true, email: true } },
          reviews: {
            include: {
              reviewer: { select: { name: true, email: true } }
            },
            orderBy: { createdAt: 'desc' },
            take: 1,
          }
        }
      }),
      prisma.scan.count({ where }),
    ]);

    return NextResponse.json({
      scans,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Queue fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch review queue' }, { status: 500 });
  }
}
