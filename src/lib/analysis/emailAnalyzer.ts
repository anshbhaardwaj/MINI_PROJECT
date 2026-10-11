import {
  EMAIL_URGENCY_PHRASES,
  EMAIL_CREDENTIAL_PHRASES,
  EMAIL_FINANCIAL_PHRASES,
  EMAIL_REWARD_PHRASES,
  GENERIC_GREETINGS,
  SUSPICIOUS_TLDS,
  URL_SHORTENERS,
  TARGET_BRANDS,
  INDIA_SCAM_CATEGORIES,
  AUDIENCE_PATTERNS,
  HINGLISH_PHISHING_PHRASES
} from './threatPatterns';
import { getScoreLevel } from '../utils';
import type { ThreatIndicator, ScamDNA } from './urlAnalyzer';

export interface EmailAnalysisResult {
  sender: string;
  subject: string;
  body: string;
  riskScore: number;
  riskLevel: string;
  threatIndicators: ThreatIndicator[];
  recommendations: string[];
  senderTrust: SenderTrust;
  suspiciousPhrases: SuspiciousPhrase[];
  extractedUrls: ExtractedURL[];
  metadata: EmailMetadata;
  scamDna: ScamDNA;
  scamCategory: string | null;
  scamNarrative: string;
  audienceTarget: string;
}

export interface SenderTrust {
  domain: string;
  isFreeEmail: boolean;
  isSuspiciousDomain: boolean;
  brandMismatch: string | null;
  trustLevel: 'trusted' | 'neutral' | 'suspicious' | 'dangerous';
  details: string;
}

export interface SuspiciousPhrase {
  text: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  explanation: string;
}

export interface ExtractedURL {
  url: string;
  riskScore: number;
  riskLevel: string;
  reasons: string[];
}

export interface EmailMetadata {
  senderEmail: string;
  senderDomain: string;
  subject: string;
  bodyLength: number;
  hasLinks: boolean;
  linkCount: number;
  hasAttachmentMention: boolean;
  hasGenericGreeting: boolean;
  urgencyLevel: 'none' | 'low' | 'medium' | 'high';
  credentialRequestDetected: boolean;
  financialRequestDetected: boolean;
  rewardClaimDetected: boolean;
}

const FREE_EMAIL_PROVIDERS = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com',
  'mail.com', 'protonmail.com', 'zoho.com', 'yandex.com', 'icloud.com',
  'rediffmail.com', 'in.com', 'sify.com'
];

export function analyzeEmail(sender: string, subject: string, body: string, headers?: string): EmailAnalysisResult {
  const indicators: ThreatIndicator[] = [];
  let totalScore = 0;

  const combined = `${sender} ${subject} ${body} ${headers || ''}`.toLowerCase();
  const subjectLower = subject.toLowerCase();

  // --- Extract sender domain ---
  const senderDomain = sender.includes('@') ? sender.split('@')[1]?.toLowerCase() || '' : '';

  // --- Signal 1: Sender Domain Analysis ---
  const isFreeEmail = FREE_EMAIL_PROVIDERS.some(p => senderDomain === p);
  let senderTrustLevel: 'trusted' | 'neutral' | 'suspicious' | 'dangerous' = 'neutral';
  let senderTrustDetails = '';
  let brandMismatch: string | null = null;

  // Check for suspicious TLD in sender domain
  const hasSuspiciousSenderTLD = SUSPICIOUS_TLDS.some(t => senderDomain.endsWith(t.replace('.', '')));
  if (hasSuspiciousSenderTLD) {
    const score = 12;
    totalScore += score;
    senderTrustLevel = 'suspicious';
    senderTrustDetails = `Sender uses a suspicious top-level domain (${senderDomain}).`;
    indicators.push({
      id: 'suspicious-sender-tld',
      name: 'Suspicious Sender Domain',
      description: 'Sender email uses a domain commonly associated with spam',
      severity: 'high',
      score,
      details: `The sender domain "${senderDomain}" uses a TLD commonly associated with phishing.`
    });
  }

  // Check brand mismatch
  for (const brand of TARGET_BRANDS) {
    const brandNameLower = brand.name.toLowerCase();
    if (combined.includes(brandNameLower) && !senderDomain.includes(brandNameLower)) {
      // Email mentions a brand but sender isn't from that brand
      if (!isFreeEmail && senderDomain !== '') {
        brandMismatch = brand.name;
        const score = 15;
        totalScore += score;
        senderTrustLevel = 'dangerous';
        senderTrustDetails = `Email discusses ${brand.name} but sender is from ${senderDomain}.`;
        indicators.push({
          id: 'brand-mismatch',
          name: 'Brand-Domain Mismatch',
          description: `Email mentions ${brand.name} but sender domain doesn't match`,
          severity: 'high',
          score,
          details: `The email references ${brand.name} but the sender domain "${senderDomain}" does not belong to ${brand.name}. This is a common phishing pattern.`
        });
        break;
      }
    }
  }

  // Check for lookalike domain
  for (const brand of TARGET_BRANDS) {
    for (const pattern of brand.patterns) {
      if (senderDomain.includes(pattern)) {
        const score = 18;
        totalScore += score;
        senderTrustLevel = 'dangerous';
        senderTrustDetails = `Sender domain appears to impersonate ${brand.name}.`;
        indicators.push({
          id: 'lookalike-sender',
          name: 'Lookalike Sender Domain',
          description: `Sender domain resembles ${brand.name}`,
          severity: 'critical',
          score,
          details: `The sender domain "${senderDomain}" contains "${pattern}" which is a known typosquatting pattern for ${brand.name}.`
        });
        break;
      }
    }
  }

  if (isFreeEmail && (subjectLower.includes('official') || subjectLower.includes('team') || subjectLower.includes('support'))) {
    const score = 8;
    totalScore += score;
    senderTrustLevel = senderTrustLevel === 'neutral' ? 'suspicious' : senderTrustLevel;
    senderTrustDetails += ' Claims to be official but uses a free email provider.';
    indicators.push({
      id: 'free-email-official',
      name: 'Free Email Claiming Official Status',
      description: 'Sender uses free email but claims to be an official source',
      severity: 'medium',
      score,
      details: `The email claims to be from an official source but uses a free email provider (${senderDomain}).`
    });
  }

  // --- Signal 2: Urgency Detection ---
  const foundUrgency = EMAIL_URGENCY_PHRASES.filter(phrase => combined.includes(phrase.toLowerCase()));
  if (foundUrgency.length > 0) {
    const score = Math.min(foundUrgency.length * 5, 18);
    totalScore += score;
    indicators.push({
      id: 'urgency-language',
      name: 'Urgency and Pressure Language',
      description: 'Email contains urgent or threatening language',
      severity: foundUrgency.length > 3 ? 'high' : 'medium',
      score,
      details: `Detected ${foundUrgency.length} urgency phrases including: "${foundUrgency.slice(0, 3).join('", "')}". Legitimate organizations rarely pressure you with extreme urgency.`
    });
  }

  // --- Signal 3: Credential Requests ---
  const foundCredentials = EMAIL_CREDENTIAL_PHRASES.filter(phrase => combined.includes(phrase.toLowerCase()));
  const credentialRequestDetected = foundCredentials.length > 0;
  if (credentialRequestDetected) {
    const score = Math.min(foundCredentials.length * 6, 20);
    totalScore += score;
    indicators.push({
      id: 'credential-request',
      name: 'Credential or Sensitive Data Request',
      description: 'Email requests passwords, OTP, or sensitive information',
      severity: 'critical',
      score,
      details: `Detected credential-related phrases: "${foundCredentials.slice(0, 3).join('", "')}". No legitimate service will ask for your password, OTP, or PIN via email.`
    });
  }

  // --- Signal 4: Financial Requests ---
  const foundFinancial = EMAIL_FINANCIAL_PHRASES.filter(phrase => combined.includes(phrase.toLowerCase()));
  const financialRequestDetected = foundFinancial.length > 0;
  if (financialRequestDetected) {
    const score = Math.min(foundFinancial.length * 5, 15);
    totalScore += score;
    indicators.push({
      id: 'financial-request',
      name: 'Financial Request Detected',
      description: 'Email contains payment or financial requests',
      severity: 'high',
      score,
      details: `Found financial indicators: "${foundFinancial.slice(0, 3).join('", "')}". Be extremely cautious about any email requesting payment or financial information.`
    });
  }

  // --- Signal 5: Reward/Prize Claims ---
  const foundRewards = EMAIL_REWARD_PHRASES.filter(phrase => combined.includes(phrase.toLowerCase()));
  const rewardClaimDetected = foundRewards.length > 0;
  if (rewardClaimDetected) {
    const score = Math.min(foundRewards.length * 5, 15);
    totalScore += score;
    indicators.push({
      id: 'reward-scam',
      name: 'Reward or Prize Scam Language',
      description: 'Email contains prize or reward claims',
      severity: 'high',
      score,
      details: `Found reward/prize language: "${foundRewards.slice(0, 3).join('", "')}". Unsolicited prize notifications are almost always scams.`
    });
  }

  // --- Signal 6: Generic Greeting ---
  const hasGenericGreeting = GENERIC_GREETINGS.some(g => combined.includes(g.toLowerCase()));
  if (hasGenericGreeting) {
    const score = 5;
    totalScore += score;
    indicators.push({
      id: 'generic-greeting',
      name: 'Generic Greeting Used',
      description: 'Email uses a generic greeting instead of your name',
      severity: 'low',
      score,
      details: 'Legitimate emails from services you use typically address you by name. Generic greetings suggest mass-targeting.'
    });
  }

  // --- Signal 7: Suspicious URLs in Body ---
  const urlRegex = /https?:\/\/[^\s<>"{}|\\^`\[\]]+/gi;
  const foundUrls = body.match(urlRegex) || [];
  const extractedUrls: ExtractedURL[] = [];
  
  for (const url of foundUrls.slice(0, 5)) {
    const urlLower = url.toLowerCase();
    const reasons: string[] = [];
    let urlScore = 0;

    if (!urlLower.startsWith('https://')) { reasons.push('Not using HTTPS'); urlScore += 10; }
    if (URL_SHORTENERS.some(s => urlLower.includes(s))) { reasons.push('URL shortener'); urlScore += 12; }
    if (/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(url)) { reasons.push('IP address URL'); urlScore += 18; }
    if (SUSPICIOUS_TLDS.some(t => urlLower.includes(t))) { reasons.push('Suspicious TLD'); urlScore += 10; }
    
    for (const brand of TARGET_BRANDS) {
      for (const pattern of brand.patterns) {
        if (urlLower.includes(pattern)) { reasons.push(`May impersonate ${brand.name}`); urlScore += 15; break; }
      }
    }

    urlScore = Math.min(urlScore, 100);
    extractedUrls.push({
      url,
      riskScore: urlScore,
      riskLevel: getScoreLevel(urlScore),
      reasons
    });
  }

  if (extractedUrls.some(u => u.riskScore > 30)) {
    const maxUrlScore = Math.max(...extractedUrls.map(u => u.riskScore));
    const score = Math.min(Math.round(maxUrlScore * 0.3), 15);
    totalScore += score;
    indicators.push({
      id: 'suspicious-urls',
      name: 'Suspicious URLs in Email Body',
      description: 'Email body contains links with phishing characteristics',
      severity: maxUrlScore > 50 ? 'high' : 'medium',
      score,
      details: `Found ${extractedUrls.length} URL(s) in email body. The highest risk URL scored ${maxUrlScore}/100.`
    });
  }

  // --- Signal 8: Attachment Mentions ---
  const attachmentPatterns = [
    'attachment', 'attached file', 'download the file', 'open the document',
    'see attached', 'invoice attached', 'document attached', '.exe', '.zip',
    '.rar', '.scr', '.bat', '.js file', '.vbs', 'macro enabled',
    'file download', 'attachment kholo', 'file download karo'
  ];
  const hasAttachmentMention = attachmentPatterns.some(p => combined.includes(p));
  if (hasAttachmentMention) {
    const score = 8;
    totalScore += score;
    indicators.push({
      id: 'attachment-risk',
      name: 'Suspicious Attachment Reference',
      description: 'Email references attachments or file downloads',
      severity: 'medium',
      score,
      details: 'The email mentions attachments or downloadable files. Malicious attachments are a primary vector for malware distribution.'
    });
  }

  // --- Signal 9: Grammar/Spelling Red Flags ---
  const grammarPatterns = [
    'kindly do the needful', 'revert back', 'please to inform',
    'we are pleased to informed', 'your the winner', 'congradulations',
    'verifiy', 'acconut', 'pasword', 'imediately', 'importent',
    'securty', 'updation', 'loging', 'suspeneded'
  ];
  const foundGrammar = grammarPatterns.filter(p => combined.includes(p));
  if (foundGrammar.length > 0) {
    const score = Math.min(foundGrammar.length * 3, 8);
    totalScore += score;
    indicators.push({
      id: 'grammar-issues',
      name: 'Grammar and Spelling Anomalies',
      description: 'Email contains unusual grammar or spelling patterns',
      severity: 'low',
      score,
      details: `Detected grammar/spelling anomalies. Professional organizations typically have well-proofread communications.`
    });
  }

  // --- Signal 10: Hinglish Phishing Detection ---
  const detectedHinglish: SuspiciousPhrase[] = [];
  for (const hp of HINGLISH_PHISHING_PHRASES) {
    if (combined.includes(hp.phrase.toLowerCase())) {
      detectedHinglish.push({
        text: hp.phrase,
        category: 'Hinglish Phishing',
        severity: hp.risk as 'low' | 'medium' | 'high' | 'critical',
        explanation: hp.meaning
      });
    }
  }
  if (detectedHinglish.length > 0) {
    const score = Math.min(detectedHinglish.length * 8, 20);
    totalScore += score;
    indicators.push({
      id: 'hinglish-phishing',
      name: 'Hinglish Phishing Phrases Detected',
      description: 'Email contains known Hinglish scam phrases',
      severity: 'high',
      score,
      details: `Detected ${detectedHinglish.length} known Hinglish phishing phrase(s): "${detectedHinglish.map(h => h.text).slice(0, 2).join('", "')}".`
    });
  }

  // Build suspicious phrases collection
  const suspiciousPhrases: SuspiciousPhrase[] = [
    ...foundUrgency.map(p => ({ text: p, category: 'Urgency', severity: 'medium' as const, explanation: 'Creates pressure to act quickly' })),
    ...foundCredentials.map(p => ({ text: p, category: 'Credential Request', severity: 'critical' as const, explanation: 'Attempts to steal sensitive credentials' })),
    ...foundFinancial.map(p => ({ text: p, category: 'Financial', severity: 'high' as const, explanation: 'Requests financial information or payment' })),
    ...foundRewards.map(p => ({ text: p, category: 'Reward Scam', severity: 'high' as const, explanation: 'Fake prize or reward claim' })),
    ...detectedHinglish
  ];

  // --- Signal 11: BharatShield Regional Scam Archetype ---
  const scamCategory = detectEmailScamCategory(combined);
  if (scamCategory && INDIA_SCAM_CATEGORIES[scamCategory as keyof typeof INDIA_SCAM_CATEGORIES]) {
    const cat = INDIA_SCAM_CATEGORIES[scamCategory as keyof typeof INDIA_SCAM_CATEGORIES];
    const score = 28;
    totalScore += score;
    indicators.push({
      id: 'scam-archetype',
      name: `BharatShield Vector: ${cat.name}`,
      description: cat.description,
      severity: 'critical',
      score,
      details: `Email payload matches verified regional fraud profile "${cat.name}".`
    });
  }

  // Clamp score
  const riskScore = Math.min(Math.max(totalScore, 0), 100);
  const riskLevel = getScoreLevel(riskScore);

  // Generate Scam DNA
  const scamDna = generateEmailScamDNA(combined, indicators, senderTrustLevel, suspiciousPhrases);

  // Detect audience
  const audienceTarget = detectEmailAudience(combined);

  // Generate narrative
  const scamNarrative = generateEmailNarrative(riskScore, riskLevel, indicators, brandMismatch, scamCategory, senderDomain);

  // Generate recommendations
  const recommendations = generateEmailRecommendations(riskLevel, indicators, brandMismatch, scamCategory);

  const urgencyLevel: 'none' | 'low' | 'medium' | 'high' = 
    foundUrgency.length === 0 ? 'none' :
    foundUrgency.length <= 1 ? 'low' :
    foundUrgency.length <= 3 ? 'medium' : 'high';

  const metadata: EmailMetadata = {
    senderEmail: sender,
    senderDomain,
    subject,
    bodyLength: body.length,
    hasLinks: foundUrls.length > 0,
    linkCount: foundUrls.length,
    hasAttachmentMention,
    hasGenericGreeting,
    urgencyLevel,
    credentialRequestDetected,
    financialRequestDetected,
    rewardClaimDetected
  };

  const senderTrust: SenderTrust = {
    domain: senderDomain,
    isFreeEmail,
    isSuspiciousDomain: hasSuspiciousSenderTLD,
    brandMismatch,
    trustLevel: senderTrustLevel,
    details: senderTrustDetails || (isFreeEmail ? 'Sender uses a free email provider.' : 'Sender domain appears standard.')
  };

  return {
    sender,
    subject,
    body,
    riskScore,
    riskLevel,
    threatIndicators: indicators,
    recommendations,
    senderTrust,
    suspiciousPhrases,
    extractedUrls,
    metadata,
    scamDna,
    scamCategory,
    scamNarrative,
    audienceTarget
  };
}

function generateEmailScamDNA(combined: string, indicators: ThreatIndicator[], senderTrust: string, phrases: SuspiciousPhrase[]): ScamDNA {
  // Identity Deception
  const identityDetails: string[] = [];
  let identityScore = 0;
  if (indicators.find(i => i.id === 'lookalike-sender')) { identityScore = 90; identityDetails.push('Sender domain impersonates a known brand'); }
  if (indicators.find(i => i.id === 'brand-mismatch')) { identityScore = Math.max(identityScore, 75); identityDetails.push('Brand mentioned does not match sender domain'); }
  if (indicators.find(i => i.id === 'free-email-official')) { identityScore = Math.max(identityScore, 40); identityDetails.push('Claims official status using free email'); }
  if (senderTrust === 'dangerous') { identityScore = Math.max(identityScore, 80); identityDetails.push('Sender domain flagged as dangerous'); }

  // Pressure Tactic
  const pressureDetails: string[] = [];
  const urgencyPhrases = phrases.filter(p => p.category === 'Urgency');
  const pressureScore = Math.min(urgencyPhrases.length * 20, 90);
  if (urgencyPhrases.length > 0) pressureDetails.push(`${urgencyPhrases.length} urgency phrases detected`);
  urgencyPhrases.slice(0, 2).forEach(p => pressureDetails.push(`"${p.text}"`));

  // Targeted Request
  const requestDetails: string[] = [];
  let requestScore = 0;
  const credPhrases = phrases.filter(p => p.category === 'Credential Request');
  const finPhrases = phrases.filter(p => p.category === 'Financial');
  if (credPhrases.length > 0) { requestScore += 40; requestDetails.push('Requests sensitive credentials'); }
  if (finPhrases.length > 0) { requestScore += 30; requestDetails.push('Requests financial information or payment'); }
  requestScore = Math.min(requestScore, 90);

  // Technical Deception
  const techDetails: string[] = [];
  let techScore = 0;
  if (indicators.find(i => i.id === 'suspicious-urls')) { techScore += 30; techDetails.push('Contains suspicious URLs'); }
  if (indicators.find(i => i.id === 'attachment-risk')) { techScore += 25; techDetails.push('References suspicious attachments'); }
  if (indicators.find(i => i.id === 'suspicious-sender-tld')) { techScore += 20; techDetails.push('Sender uses suspicious TLD'); }
  techScore = Math.min(techScore, 90);

  // Audience
  const audience = detectEmailAudience(combined);

  return {
    identityDeception: { score: identityScore, details: identityDetails },
    pressureTactic: { score: pressureScore, details: pressureDetails },
    targetedRequest: { score: requestScore, details: requestDetails },
    technicalDeception: { score: techScore, details: techDetails },
    audienceTargeting: { score: identityScore > 0 || requestScore > 0 ? 60 : 20, details: [`Likely targeting: ${audience}`], audience },
  };
}

function detectEmailScamCategory(combined: string): string | null {
  const textLower = combined.toLowerCase();
  let bestMatch: string | null = null;
  let bestCount = 0;

  for (const [key, category] of Object.entries(INDIA_SCAM_CATEGORIES)) {
    const matches = category.keywords.filter(kw => textLower.includes(kw.toLowerCase()));
    if (matches.length >= 1 && matches.length > bestCount) {
      bestCount = matches.length;
      bestMatch = key;
    }
  }

  return bestMatch;
}

function detectEmailAudience(text: string): string {
  const textLower = text.toLowerCase();

  for (const [key, pattern] of Object.entries(AUDIENCE_PATTERNS)) {
    if (key === 'GENERAL') continue;
    const matches = pattern.keywords.filter(kw => textLower.includes(kw));
    if (matches.length >= 2) return pattern.label;
  }

  return 'General Users';
}

function generateEmailNarrative(
  score: number, level: string, indicators: ThreatIndicator[],
  brand: string | null, scamCategory: string | null, senderDomain: string
): string {
  if (score <= 24) {
    return 'This email appears to be relatively safe based on our analysis. No significant phishing indicators were detected in the content, sender, or embedded links. However, always verify sender identity before taking any action.';
  }

  const parts: string[] = [];

  if (scamCategory && INDIA_SCAM_CATEGORIES[scamCategory as keyof typeof INDIA_SCAM_CATEGORIES]) {
    const cat = INDIA_SCAM_CATEGORIES[scamCategory as keyof typeof INDIA_SCAM_CATEGORIES];
    parts.push(`This email is likely a ${cat.name.toLowerCase()}`);
    parts.push(cat.description);
  } else if (brand) {
    parts.push(`This email appears to impersonate ${brand} using the sender domain "${senderDomain}"`);
  } else {
    parts.push('This email shows characteristics commonly associated with phishing or scam messages');
  }

  const critical = indicators.filter(i => i.severity === 'critical');
  const high = indicators.filter(i => i.severity === 'high');
  if (critical.length > 0) {
    parts.push(`Critical concerns: ${critical.map(i => i.name.toLowerCase()).join(', ')}`);
  } else if (high.length > 0) {
    parts.push(`Key warning signs include: ${high.map(i => i.name.toLowerCase()).join(', ')}`);
  }

  if (score >= 75) {
    parts.push('Do not respond to this email, click any links, or download any attachments. Report it immediately');
  } else if (score >= 50) {
    parts.push('Exercise extreme caution. Verify the sender through official channels before taking any action');
  } else {
    parts.push('Verify the sender identity and any claims made in this email through independent channels');
  }

  return parts.join('. ') + '.';
}

function generateEmailRecommendations(level: string, indicators: ThreatIndicator[], brand: string | null, scamCategory: string | null): string[] {
  const recs: string[] = [];

  switch (level) {
    case 'SAFE':
      recs.push('This email appears safe, but always verify the sender before clicking links or downloading attachments.');
      recs.push('Check that the sender email domain matches the organization they claim to represent.');
      recs.push('When in doubt, contact the organization directly through their official website.');
      break;
    case 'SUSPICIOUS':
      recs.push('Do not click any links or download any attachments from this email.');
      recs.push('Verify the sender by contacting the organization through their official website or phone number.');
      recs.push('Check the sender email address carefully for spelling variations or unusual domains.');
      if (brand) recs.push(`Contact ${brand} directly through their official support channels.`);
      break;
    case 'HIGH_RISK':
      recs.push('Do not reply to this email, click any links, or download any attachments.');
      recs.push('Report this email as phishing in your email client.');
      recs.push('If the email mentions an account issue, visit the organization\'s official website directly.');
      recs.push('Never share OTP, passwords, UPI PIN, or banking details via email.');
      if (brand) recs.push(`This may be impersonating ${brand}. Contact their official support immediately.`);
      break;
    case 'CRITICAL':
      recs.push('This email is very likely a phishing attempt. Do NOT interact with it in any way.');
      recs.push('Mark it as spam/phishing and delete it immediately.');
      recs.push('If you already responded or clicked links, change your passwords immediately.');
      recs.push('Enable two-factor authentication on all your accounts.');
      recs.push('Report to India Cyber Crime helpline: 1930 or cybercrime.gov.in');
      if (brand) recs.push(`Alert ${brand}'s official support about this impersonation attempt.`);
      break;
  }

  if (scamCategory) {
    const catInfo = INDIA_SCAM_CATEGORIES[scamCategory as keyof typeof INDIA_SCAM_CATEGORIES];
    if (catInfo) {
      recs.push(`Scam type identified: ${catInfo.name}. ${catInfo.description}`);
    }
  }

  return recs;
}
