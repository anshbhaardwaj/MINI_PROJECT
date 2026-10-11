import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession, checkRateLimit } from '@/lib/auth/auth';
import { emailAnalysisSchema } from '@/lib/validations';
import { analyzeEmail } from '@/lib/analysis/emailAnalyzer';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    if (!checkRateLimit(session.id)) {
      return NextResponse.json({ error: 'Please wait a few seconds between scans' }, { status: 429 });
    }

    const body = await req.json();
    const parsed = emailAnalysisSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Validation failed' },
        { status: 400 }
      );
    }

    const { sender, subject, body: emailBody, headers } = parsed.data;

    // Analyze email content
    const result = analyzeEmail(sender, subject, emailBody, headers);

    // Determine review status
    const needsReview = result.riskScore >= 35 && result.riskScore <= 70;
    const approvalStatus = needsReview ? 'NEEDS_REVIEW' : 'AUTO_ANALYZED';

    // Combine inputs for storage
    const originalInput = JSON.stringify({ sender, subject, body: emailBody, headers });

    const scan = await prisma.scan.create({
      data: {
        userId: session.id,
        type: 'EMAIL',
        originalInput,
        riskScore: result.riskScore,
        riskLevel: result.riskLevel,
        metadata: JSON.stringify(result.metadata),
        threatIndicators: JSON.stringify(result.threatIndicators),
        recommendations: JSON.stringify(result.recommendations),
        scamDna: JSON.stringify(result.scamDna),
        scamCategory: result.scamCategory,
        scamNarrative: result.scamNarrative,
        audienceTarget: result.audienceTarget,
        approvalStatus,
        needsReview,
      }
    });

    return NextResponse.json({
      scan: {
        id: scan.id,
        ...result,
        approvalStatus,
        needsReview,
      }
    });
  } catch (error) {
    console.error('Email analysis error:', error);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
