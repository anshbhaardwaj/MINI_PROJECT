import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const prefs = await prisma.userPreference.findUnique({
      where: { userId: session.id }
    });

    return NextResponse.json({ preferences: prefs });
  } catch (error) {
    console.error('Preferences fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch preferences' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const { theme, studentSafetyMode, emailNotifications, scanAlerts, weeklyReport } = body;

    const prefs = await prisma.userPreference.upsert({
      where: { userId: session.id },
      update: {
        ...(theme !== undefined && { theme }),
        ...(studentSafetyMode !== undefined && { studentSafetyMode }),
        ...(emailNotifications !== undefined && { emailNotifications }),
        ...(scanAlerts !== undefined && { scanAlerts }),
        ...(weeklyReport !== undefined && { weeklyReport }),
      },
      create: {
        userId: session.id,
        theme: theme || 'system',
        studentSafetyMode: studentSafetyMode || false,
        emailNotifications: emailNotifications ?? true,
        scanAlerts: scanAlerts ?? true,
        weeklyReport: weeklyReport || false,
      },
    });

    return NextResponse.json({ preferences: prefs });
  } catch (error) {
    console.error('Preferences update error:', error);
    return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 });
  }
}
