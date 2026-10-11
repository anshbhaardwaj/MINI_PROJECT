import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const type = searchParams.get('type'); // URL or EMAIL
    const riskLevel = searchParams.get('riskLevel');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const where: Record<string, unknown> = { userId: session.id };
    if (type) where.type = type;
    if (riskLevel) where.riskLevel = riskLevel;
    if (search) {
      where.originalInput = { contains: search };
    }

    const [scans, total] = await Promise.all([
      prisma.scan.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
        include: {
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
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    console.error('Scans fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch scans' }, { status: 500 });
  }
}
