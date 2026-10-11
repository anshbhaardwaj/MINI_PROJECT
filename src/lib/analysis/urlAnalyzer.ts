import {
  SUSPICIOUS_TLDS,
  URL_SHORTENERS,
  TARGET_BRANDS,
  SUSPICIOUS_URL_KEYWORDS,
  INDIA_SCAM_CATEGORIES,
  AUDIENCE_PATTERNS
} from './threatPatterns';
import { getScoreLevel } from '../utils';

export interface URLAnalysisResult {
  url: string;
  domain: string;
  protocol: string;
  urlLength: number;
  subdomainCount: number;
  hasIPAddress: boolean;
  hasSuspiciousChars: boolean;
  suspiciousKeywords: string[];
  isHTTPS: boolean;
  riskScore: number;
  riskLevel: string;
  threatIndicators: ThreatIndicator[];
  recommendations: string[];
  metadata: URLMetadata;
  scamDna: ScamDNA;
  scamCategory: string | null;
  scamNarrative: string;
  audienceTarget: string;
}

export interface ThreatIndicator {
  id: string;
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  score: number;
  details: string;
}

export interface URLMetadata {
  fullUrl: string;
  domain: string;
  protocol: string;
  path: string;
  queryParams: string;
  urlLength: number;
  subdomainCount: number;
  hasIPAddress: boolean;
  hasSuspiciousChars: boolean;
  hasAtSymbol: boolean;
  isHTTPS: boolean;
  tld: string;
  isUrlShortener: boolean;
  hasExcessiveHyphens: boolean;
  hasEncodedChars: boolean;
  suspiciousKeywordsFound: string[];
  brandImpersonation: string | null;
}

export interface ScamDNA {
  identityDeception: { score: number; details: string[] };
  pressureTactic: { score: number; details: string[] };
  targetedRequest: { score: number; details: string[] };
  technicalDeception: { score: number; details: string[] };
  audienceTargeting: { score: number; details: string[]; audience: string };
}

export function analyzeURL(url: string): URLAnalysisResult {
  const indicators: ThreatIndicator[] = [];
  let totalScore = 0;
  
  // Parse URL safely - never visit it
  let parsedUrl: URL;
  let domain = '';
  let protocol = '';
  let path = '';
  let queryParams = '';
  let tld = '';
  
  try {
    // Add protocol if missing for parsing
    const urlToParse = url.match(/^https?:\/\//) ? url : `http://${url}`;
    parsedUrl = new URL(urlToParse);
    domain = parsedUrl.hostname;
    protocol = parsedUrl.protocol.replace(':', '');
    path = parsedUrl.pathname;
    queryParams = parsedUrl.search;
    const domainParts = domain.split('.');
    tld = '.' + domainParts[domainParts.length - 1];
  } catch {
    domain = url;
    protocol = 'unknown';
  }

  const urlLower = url.toLowerCase();
  const domainLower = domain.toLowerCase();

  // --- Signal 1: No HTTPS ---
  const isHTTPS = protocol === 'https';
  if (!isHTTPS) {
    const score = 8;
    totalScore += score;
    indicators.push({
      id: 'no-https',
      name: 'No HTTPS Encryption',
      description: 'The URL does not use HTTPS encryption',
      severity: 'medium',
      score,
      details: `Protocol is "${protocol}" instead of "https". Legitimate websites handling sensitive data use HTTPS.`
    });
  }

  // --- Signal 2: IP Address instead of domain ---
  const ipPattern = /^(\d{1,3}\.){3}\d{1,3}/;
  const hasIPAddress = ipPattern.test(domain);
  if (hasIPAddress) {
    const score = 20;
    totalScore += score;
    indicators.push({
      id: 'ip-address',
      name: 'IP Address URL',
      description: 'URL uses an IP address instead of a domain name',
      severity: 'high',
      score,
      details: `The URL points to IP address "${domain}" instead of a readable domain. Phishing sites often use IP addresses to hide their identity.`
    });
  }

  // --- Signal 3: URL Length ---
  const urlLength = url.length;
  if (urlLength > 75) {
    const score = urlLength > 150 ? 12 : 6;
    totalScore += score;
    indicators.push({
      id: 'long-url',
      name: 'Excessive URL Length',
      description: 'URL is unusually long',
      severity: urlLength > 150 ? 'high' : 'medium',
      score,
      details: `URL length is ${urlLength} characters. Very long URLs are often used to hide malicious content and confuse users.`
    });
  }

  // --- Signal 4: Subdomains ---
  const subdomains = domain.split('.').length - 2;
  if (subdomains > 2) {
    const score = subdomains > 4 ? 15 : 8;
    totalScore += score;
    indicators.push({
      id: 'excessive-subdomains',
      name: 'Excessive Subdomains',
      description: 'URL has an unusual number of subdomains',
      severity: subdomains > 4 ? 'high' : 'medium',
      score,
      details: `Found ${subdomains} subdomains. Phishing URLs often add many subdomains to make a trusted brand appear in the URL.`
    });
  }

  // --- Signal 5: Suspicious TLD ---
  const hasSuspiciousTLD = SUSPICIOUS_TLDS.some(t => domainLower.endsWith(t));
  if (hasSuspiciousTLD) {
    const score = 10;
    totalScore += score;
    indicators.push({
      id: 'suspicious-tld',
      name: 'Suspicious Top-Level Domain',
      description: 'URL uses a top-level domain commonly associated with phishing',
      severity: 'medium',
      score,
      details: `The TLD "${tld}" is commonly used in phishing campaigns due to free or cheap registration.`
    });
  }

  // --- Signal 6: URL Shortener ---
  const isUrlShortener = URL_SHORTENERS.some(s => domainLower.includes(s));
  if (isUrlShortener) {
    const score = 12;
    totalScore += score;
    indicators.push({
      id: 'url-shortener',
      name: 'URL Shortener Detected',
      description: 'URL uses a link shortening service',
      severity: 'medium',
      score,
      details: 'Shortened URLs hide the actual destination. While not always malicious, they are commonly used in phishing to disguise dangerous links.'
    });
  }

  // --- Signal 7: Brand Impersonation ---
  let brandImpersonation: string | null = null;
  for (const brand of TARGET_BRANDS) {
    for (const pattern of brand.patterns) {
      if (domainLower.includes(pattern)) {
        brandImpersonation = brand.name;
        const score = 32;
        totalScore += score;
        indicators.push({
          id: 'brand-impersonation',
          name: 'Brand Impersonation Detected',
          description: `URL may be impersonating ${brand.name}`,
          severity: 'critical',
          score,
          details: `Found "${pattern}" in the domain, which appears to be a typosquatting attempt targeting ${brand.name}. Verify with the official website.`
        });
        break;
      }
    }
    if (brandImpersonation) break;
  }

  // --- Signal 8: Suspicious Keywords ---
  const suspiciousKeywords = SUSPICIOUS_URL_KEYWORDS.filter(kw => urlLower.includes(kw));
  if (suspiciousKeywords.length > 0) {
    const score = Math.min(suspiciousKeywords.length * 4, 16);
    totalScore += score;
    indicators.push({
      id: 'suspicious-keywords',
      name: 'Suspicious Keywords',
      description: 'URL contains keywords commonly found in phishing URLs',
      severity: suspiciousKeywords.length > 3 ? 'high' : 'medium',
      score,
      details: `Found suspicious keywords: ${suspiciousKeywords.join(', ')}. These terms are frequently used in phishing URLs.`
    });
  }

  // --- Signal 9: @ Symbol ---
  const hasAtSymbol = url.includes('@');
  if (hasAtSymbol) {
    const score = 14;
    totalScore += score;
    indicators.push({
      id: 'at-symbol',
      name: '@ Symbol in URL',
      description: 'URL contains an @ symbol which can be used for deception',
      severity: 'high',
      score,
      details: 'The @ symbol in URLs can redirect to a different domain than what appears before it. This is a common phishing technique.'
    });
  }

  // --- Signal 10: Excessive Hyphens ---
  const hyphenCount = (domain.match(/-/g) || []).length;
  const hasExcessiveHyphens = hyphenCount > 3;
  if (hasExcessiveHyphens) {
    const score = 8;
    totalScore += score;
    indicators.push({
      id: 'excessive-hyphens',
      name: 'Excessive Hyphens in Domain',
      description: 'Domain contains an unusual number of hyphens',
      severity: 'medium',
      score,
      details: `Found ${hyphenCount} hyphens in the domain. Phishing domains often use hyphens to mimic legitimate brand names.`
    });
  }

  // --- Signal 11: Encoded Characters ---
  const hasEncodedChars = /%[0-9a-fA-F]{2}/.test(url);
  const hasSuspiciousChars = /[{}|\\^~\[\]`]/.test(url) || hasEncodedChars;
  if (hasSuspiciousChars) {
    const score = 6;
    totalScore += score;
    indicators.push({
      id: 'encoded-chars',
      name: 'Encoded or Special Characters',
      description: 'URL contains encoded or suspicious special characters',
      severity: 'low',
      score,
      details: 'Encoded or unusual characters can be used to obfuscate the true destination of a URL.'
    });
  }

  // --- Signal 12: Long Query Parameters ---
  if (queryParams.length > 100) {
    const score = 5;
    totalScore += score;
    indicators.push({
      id: 'long-query',
      name: 'Excessive Query Parameters',
      description: 'URL has unusually long query parameters',
      severity: 'low',
      score,
      details: `Query string is ${queryParams.length} characters long. This may contain hidden tracking or redirect parameters.`
    });
  }

  // --- Signal 13: Multiple Redirects Pattern ---
  const redirectPatterns = (url.match(/https?:\/\//g) || []).length;
  if (redirectPatterns > 1) {
    const score = 12;
    totalScore += score;
    indicators.push({
      id: 'redirect-pattern',
      name: 'Multiple Redirect Pattern',
      description: 'URL appears to contain embedded redirect URLs',
      severity: 'high',
      score,
      details: `Found ${redirectPatterns} URL protocols, suggesting embedded redirects. This is a common technique to bypass security filters.`
    });
  }

  // --- Signal 14: Repeated Slashes ---
  if ((url.match(/\/{3,}/g) || []).length > 0) {
    const score = 5;
    totalScore += score;
    indicators.push({
      id: 'repeated-slashes',
      name: 'Repeated Forward Slashes',
      description: 'URL contains unusual repeated slashes',
      severity: 'low',
      score,
      details: 'Repeated forward slashes can indicate URL manipulation or obfuscation attempts.'
    });
  }

  // --- Signal 15: BharatShield Regional Scam Archetype ---
  const scamCategory = detectURLScamCategory(url, domain);
  if (scamCategory && (INDIA_SCAM_CATEGORIES as Record<string, { id: string; name: string; description: string; keywords: string[] }>)[scamCategory]) {
    const cat = (INDIA_SCAM_CATEGORIES as Record<string, { id: string; name: string; description: string; keywords: string[] }>)[scamCategory];
    const score = 30;
    totalScore += score;
    indicators.push({
      id: 'scam-archetype',
      name: `BharatShield Vector: ${cat.name}`,
      description: cat.description,
      severity: 'critical',
      score,
      details: `URL tokens match high-risk regional scam vector "${cat.name}".`
    });
  }

  // Clamp score
  const riskScore = Math.min(Math.max(totalScore, 0), 100);
  const riskLevel = getScoreLevel(riskScore);

  // Generate Scam DNA
  const scamDna = generateURLScamDNA(url, domain, indicators, suspiciousKeywords);
  
  // Detect audience
  const audienceTarget = detectAudience(url + ' ' + domain);
  
  // Generate narrative
  const scamNarrative = generateURLNarrative(riskScore, riskLevel, indicators, brandImpersonation, scamCategory);

  // Generate recommendations
  const recommendations = generateURLRecommendations(riskLevel, indicators, brandImpersonation);

  const metadata: URLMetadata = {
    fullUrl: url,
    domain,
    protocol,
    path,
    queryParams,
    urlLength,
    subdomainCount: subdomains,
    hasIPAddress,
    hasSuspiciousChars,
    hasAtSymbol,
    isHTTPS,
    tld,
    isUrlShortener,
    hasExcessiveHyphens,
    hasEncodedChars,
    suspiciousKeywordsFound: suspiciousKeywords,
    brandImpersonation,
  };

  return {
    url,
    domain,
    protocol,
    urlLength,
    subdomainCount: subdomains,
    hasIPAddress,
    hasSuspiciousChars,
    suspiciousKeywords,
    isHTTPS,
    riskScore,
    riskLevel,
    threatIndicators: indicators,
    recommendations,
    metadata,
    scamDna,
    scamCategory,
    scamNarrative,
    audienceTarget,
  };
}

function generateURLScamDNA(url: string, domain: string, indicators: ThreatIndicator[], keywords: string[]): ScamDNA {
  const urlLower = url.toLowerCase();
  
  // Identity Deception
  const identityDetails: string[] = [];
  let identityScore = 0;
  const brandIndicator = indicators.find(i => i.id === 'brand-impersonation');
  if (brandIndicator) {
    identityScore = 85;
    identityDetails.push(brandIndicator.details);
  }
  if (indicators.find(i => i.id === 'ip-address')) {
    identityScore = Math.max(identityScore, 60);
    identityDetails.push('Uses IP address to hide real identity');
  }

  // Pressure Tactic
  const pressureDetails: string[] = [];
  let pressureScore = 0;
  const urgencyWords = ['urgent', 'immediately', 'expire', 'suspend', 'locked', 'alert'];
  const foundUrgency = urgencyWords.filter(w => urlLower.includes(w) || keywords.includes(w));
  if (foundUrgency.length > 0) {
    pressureScore = Math.min(foundUrgency.length * 25, 80);
    pressureDetails.push(`URL contains urgency keywords: ${foundUrgency.join(', ')}`);
  }

  // Targeted Request
  const requestDetails: string[] = [];
  let requestScore = 0;
  const requestWords = ['login', 'password', 'verify', 'otp', 'pin', 'account', 'credential', 'banking'];
  const foundRequests = requestWords.filter(w => urlLower.includes(w));
  if (foundRequests.length > 0) {
    requestScore = Math.min(foundRequests.length * 20, 80);
    requestDetails.push(`URL targets sensitive actions: ${foundRequests.join(', ')}`);
  }

  // Technical Deception
  const techDetails: string[] = [];
  let techScore = 0;
  if (indicators.find(i => i.id === 'url-shortener')) { techScore += 20; techDetails.push('Uses URL shortener'); }
  if (indicators.find(i => i.id === 'encoded-chars')) { techScore += 15; techDetails.push('Contains encoded characters'); }
  if (indicators.find(i => i.id === 'no-https')) { techScore += 15; techDetails.push('No HTTPS encryption'); }
  if (indicators.find(i => i.id === 'redirect-pattern')) { techScore += 25; techDetails.push('Contains redirect patterns'); }
  if (indicators.find(i => i.id === 'excessive-subdomains')) { techScore += 15; techDetails.push('Excessive subdomain usage'); }
  techScore = Math.min(techScore, 90);

  // Audience
  const audience = detectAudience(url + ' ' + domain);

  return {
    identityDeception: { score: identityScore, details: identityDetails },
    pressureTactic: { score: pressureScore, details: pressureDetails },
    targetedRequest: { score: requestScore, details: requestDetails },
    technicalDeception: { score: techScore, details: techDetails },
    audienceTargeting: { score: identityScore > 0 || requestScore > 0 ? 50 : 20, details: [`Likely targeting: ${audience}`], audience },
  };
}

function detectURLScamCategory(url: string, domain: string): string | null {
  const combined = `${url} ${domain}`.toLowerCase().replace(/[-_/.]/g, ' ');
  
  for (const [key, category] of Object.entries(INDIA_SCAM_CATEGORIES)) {
    const matches = category.keywords.filter(kw => combined.includes(kw.toLowerCase()));
    if (matches.length >= 1) return key;
  }
  
  return null;
}

function detectAudience(text: string): string {
  const textLower = text.toLowerCase();
  
  for (const [key, pattern] of Object.entries(AUDIENCE_PATTERNS)) {
    if (key === 'GENERAL') continue;
    const matches = pattern.keywords.filter(kw => textLower.includes(kw));
    if (matches.length >= 1) return pattern.label;
  }
  
  return 'General Users';
}

function generateURLNarrative(
  score: number, level: string, indicators: ThreatIndicator[],
  brand: string | null, scamCategory: string | null
): string {
  if (score <= 24) {
    return 'This URL appears to be relatively safe based on our analysis. No significant phishing indicators were detected. However, always exercise caution when visiting unfamiliar websites.';
  }

  const parts: string[] = [];
  
  if (brand) {
    parts.push(`This URL appears to impersonate ${brand}`);
  } else {
    parts.push('This URL shows characteristics commonly associated with phishing');
  }

  if (scamCategory && INDIA_SCAM_CATEGORIES[scamCategory as keyof typeof INDIA_SCAM_CATEGORIES]) {
    const cat = INDIA_SCAM_CATEGORIES[scamCategory as keyof typeof INDIA_SCAM_CATEGORIES];
    parts.push(cat.description);
  }

  const highSeverity = indicators.filter(i => i.severity === 'high' || i.severity === 'critical');
  if (highSeverity.length > 0) {
    parts.push(`Key concerns include: ${highSeverity.map(i => i.name.toLowerCase()).join(', ')}`);
  }

  if (score >= 75) {
    parts.push('We strongly recommend not visiting this URL and reporting it as potential phishing');
  } else if (score >= 50) {
    parts.push('Exercise extreme caution if you must interact with this URL');
  } else {
    parts.push('Verify the URL through official channels before proceeding');
  }

  return parts.join('. ') + '.';
}

function generateURLRecommendations(level: string, indicators: ThreatIndicator[], brand: string | null): string[] {
  const recs: string[] = [];

  switch (level) {
    case 'SAFE':
      recs.push('This URL appears safe, but always verify the domain before entering personal information.');
      recs.push('Check that the website has a valid SSL certificate (padlock icon in browser).');
      recs.push('Bookmark trusted websites to avoid typing URLs manually.');
      break;
    case 'SUSPICIOUS':
      recs.push('Exercise caution — do not enter sensitive information on this website.');
      recs.push('Verify the URL by searching for the organization through a trusted search engine.');
      recs.push('Check the domain spelling carefully for typosquatting attempts.');
      if (brand) recs.push(`Visit ${brand}'s official website directly instead of using this link.`);
      break;
    case 'HIGH_RISK':
      recs.push('Do not click this link or enter any personal information.');
      recs.push('If you received this link via email or message, report it as phishing.');
      recs.push('Contact the supposed organization through their official website or customer service.');
      if (brand) recs.push(`This may be impersonating ${brand}. Visit their official site directly for any account actions.`);
      recs.push('Report this URL to your IT department or cybercrime authorities.');
      break;
    case 'CRITICAL':
      recs.push('Do NOT visit this URL under any circumstances.');
      recs.push('Block and report this link immediately.');
      recs.push('If you already visited this URL, change your passwords immediately.');
      recs.push('Run a security scan on your device.');
      if (brand) recs.push(`Contact ${brand}'s official support to verify any claims made through this link.`);
      recs.push('Report to India Cyber Crime: 1930 or cybercrime.gov.in');
      break;
  }

  return recs;
}
