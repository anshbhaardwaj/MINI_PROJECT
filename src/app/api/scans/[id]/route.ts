import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { id } = await params;

    const scan = await prisma.scan.findFirst({
      where: {
        id,
        // Users see their own scans; admins see all
        ...(session.role !== 'ADMIN' ? { userId: session.id } : {}),
      },
      include: {
        reviews: {
          include: {
            reviewer: { select: { name: true, email: true } }
          },
          orderBy: { createdAt: 'desc' },
        },
        user: { select: { name: true, email: true } }
      }
    });

    if (!scan) {
      return NextResponse.json({ error: 'Scan not found' }, { status: 404 });
    }

    return NextResponse.json({ scan });
  } catch (error) {
    console.error('Scan fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch scan' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { id } = await params;

    const scan = await prisma.scan.findFirst({
      where: { id, userId: session.id },
    });

    if (!scan) {
      return NextResponse.json({ error: 'Scan not found' }, { status: 404 });
    }

    await prisma.scan.delete({ where: { id } });

    return NextResponse.json({ message: 'Scan deleted successfully' });
  } catch (error) {
    console.error('Scan delete error:', error);
    return NextResponse.json({ error: 'Failed to delete scan' }, { status: 500 });
  }
}
