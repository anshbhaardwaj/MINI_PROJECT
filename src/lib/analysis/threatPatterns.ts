// Comprehensive threat patterns for phishing detection

export interface ThreatPattern {
  id: string;
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  weight: number;
  category: string;
}

// Suspicious TLDs commonly used in phishing
export const SUSPICIOUS_TLDS = [
  '.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top', '.work', '.click',
  '.link', '.info', '.online', '.site', '.website', '.space', '.buzz',
  '.icu', '.club', '.win', '.bid', '.stream', '.download', '.racing',
  '.review', '.country', '.cricket', '.science', '.party', '.date',
  '.faith', '.accountant', '.loan', '.men', '.trade', '.support',
  '.shop', '.cc', '.biz', '.live', '.vip'
];

// Known URL shortener domains
export const URL_SHORTENERS = [
  'bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'ow.ly', 'is.gd',
  'buff.ly', 'adf.ly', 'bl.ink', 'lnkd.in', 'db.tt', 'qr.ae',
  'cur.lv', 'ity.im', 'q.gs', 'po.st', 'bc.vc', 'twitthis.com',
  'u.nu', 'tiny.cc', 'yourls.org', 'shorturl.at', 'rb.gy',
  'cutt.ly', 'v.gd', 'rebrand.ly', 'short.io'
];

// Brands commonly impersonated in phishing attacks
export const TARGET_BRANDS = [
  { name: 'PayPal', patterns: ['paypa1', 'paypaI', 'pay-pal', 'paypal-', 'paypai', 'peypal'] },
  { name: 'Apple', patterns: ['app1e', 'appie', 'apple-', 'icloud-', 'appleid-'] },
  { name: 'Microsoft', patterns: ['micr0soft', 'microsft', 'microsoft-', 'outlook-', 'office365-'] },
  { name: 'Google', patterns: ['go0gle', 'googIe', 'google-', 'gmail-', 'g00gle'] },
  { name: 'Amazon', patterns: ['amaz0n', 'amazan', 'amazon-', 'arnazon', 'armazom'] },
  { name: 'Netflix', patterns: ['netf1ix', 'netflix-', 'netfix', 'nettflix'] },
  { name: 'Facebook', patterns: ['faceb00k', 'facebock', 'facebook-', 'fb-login'] },
  { name: 'Instagram', patterns: ['instagran', 'instagram-', 'instagrarn'] },
  { name: 'WhatsApp', patterns: ['whatsap', 'whatsapp-', 'watsapp', 'whatsaap'] },
  { name: 'SBI', patterns: ['sbi-', 'onlinesbi-', 'sbionline-', 'sbi-bank'] },
  { name: 'HDFC', patterns: ['hdfc-', 'hdfcbank-', 'hdfc-net', 'hdfcnetbanking'] },
  { name: 'ICICI', patterns: ['icici-', 'icicibank-', 'icici-net'] },
  { name: 'Paytm', patterns: ['paytm-', 'paytm-mall', 'paytnn', 'peytm'] },
  { name: 'PhonePe', patterns: ['phonepe-', 'phonpe', 'phonepay'] },
  { name: 'GPay', patterns: ['gpay-', 'googlepay-', 'g-pay'] },
  { name: 'Flipkart', patterns: ['flipkart-', 'f1ipkart', 'flipkert'] },
  { name: 'Myntra', patterns: ['myntra-', 'myntra-sale'] },
  { name: 'Zomato', patterns: ['zomato-', 'zomat0'] },
  { name: 'Swiggy', patterns: ['swiggy-', 'swigy'] },
  { name: 'Aadhaar', patterns: ['aadhaar-', 'aadhar-', 'uidai-'] },
  { name: 'PAN', patterns: ['pan-update', 'pan-verify', 'income-tax-'] },
  { name: 'EPF', patterns: ['epf-', 'epfo-', 'pf-claim'] },
  { name: 'GitHub', patterns: ['githvb', 'g1thub', 'github-', 'git-hub', 'githuub', 'githubb', 'gitthub', 'github-login', 'github-repo', 'github-verify', 'github-auth'] },
];

// Suspicious keywords in URLs
export const SUSPICIOUS_URL_KEYWORDS = [
  'login', 'signin', 'sign-in', 'verify', 'verification', 'confirm',
  'update', 'secure', 'security', 'account', 'password', 'credential',
  'banking', 'wallet', 'payment', 'pay', 'bank', 'otp', 'pin',
  'reset', 'suspend', 'locked', 'unusual', 'activity', 'alert',
  'expire', 'upgrade', 'validate', 'authenticate', 'restore',
  'recover', 'unlock', 'reactivate', 'webscr', 'customer',
  'support', 'service', 'claim', 'refund', 'reward', 'prize',
  'winner', 'congratulation', 'urgent', 'immediately', 'action',
  'kyc', 'aadhaar', 'aadhar', 'pancard', 'upi'
];

// Email phishing patterns
export const EMAIL_URGENCY_PHRASES = [
  'act now', 'immediate action required', 'urgent', 'expires today',
  'last chance', 'account will be suspended', 'verify immediately',
  'within 24 hours', 'within 48 hours', 'failure to comply',
  'your account has been compromised', 'unauthorized access',
  'suspicious activity detected', 'security alert',
  'account will be blocked', 'action required immediately',
  'do not ignore', 'time-sensitive', 'respond immediately',
  'final warning', 'last reminder', 'account closure',
  'turant', 'jaldi', 'abhi', 'fauran', 'tatkaal',
  'aaj hi', '24 ghante mein', 'block ho jayega',
  'band ho jayega', 'suspend ho jayega'
];

export const EMAIL_CREDENTIAL_PHRASES = [
  'enter your password', 'verify your identity', 'confirm your details',
  'update your information', 'click here to login', 'reset your password',
  'share your otp', 'enter otp', 'send otp', 'verify otp',
  'bank account number', 'credit card number', 'credit card', 'debit card',
  'cvv', 'expiry date', 'card details', 'pin number', 'billing info', 'card info',
  'social security', 'aadhaar number', 'pan number', 'pan card',
  'upi pin', 'upi id', 'mpin', 'internet banking password',
  'apna password dijiye', 'otp bhejiye', 'otp share karein',
  'bank details bhejiye', 'card number daale', 'pin bataye'
];

export const EMAIL_FINANCIAL_PHRASES = [
  'payment required', 'processing fee', 'registration fee',
  'advance payment', 'transfer amount', 'send money',
  'gift card', 'bitcoin', 'cryptocurrency', 'wire transfer',
  'urgent wire transfer', 'confidential wire',
  'western union', 'money order', 'cashier check',
  'pay now', 'make payment', 'complete payment',
  'upi payment', 'paytm kare', 'phonepe kare', 'gpay kare',
  'rupees', '₹', 'rs.', 'inr', 'pay karein', 'bhugtan karein',
  'registration fee bhare', 'processing charge'
];

export const EMAIL_REWARD_PHRASES = [
  'congratulations', 'you have won', 'prize winner', 'lottery',
  'claim your reward', 'cashback', 'refund', 'bonus',
  'free gift', 'selected winner', 'lucky draw',
  'offer expires', 'limited time offer', 'exclusive deal',
  'aapne jeeta hai', 'badhai ho', 'inam', 'lottery jeet',
  'cashback milega', 'refund milega', 'free mein',
  'muft', 'prize jeeta', 'lucky winner'
];

export const GENERIC_GREETINGS = [
  'dear customer', 'dear user', 'dear sir', 'dear madam',
  'dear account holder', 'dear valued customer', 'dear member',
  'dear friend', 'hello user', 'respected sir',
  'respected madam', 'dear sir/madam', 'to whom it may concern',
  'priya graaahak', 'priye', 'respected customer'
];

// India-specific scam categories
export const INDIA_SCAM_CATEGORIES = {
  FAKE_INTERNSHIP: {
    id: 'FAKE_INTERNSHIP',
    name: 'Fake Internship/Placement Offer',
    keywords: ['internship', 'placement', 'campus recruitment', 'hiring', 'job offer',
      'stipend', 'joining letter', 'offer letter', 'selection', 'shortlisted',
      'internship ke liye', 'placement mil gaya', 'job opportunity'],
    description: 'Fraudulent job or internship offers that request upfront payment or personal information.'
  },
  FAKE_SCHOLARSHIP: {
    id: 'FAKE_SCHOLARSHIP',
    name: 'Fake Scholarship/Education Loan',
    keywords: ['scholarship', 'education loan', 'fee waiver', 'student aid',
      'financial assistance', 'grant', 'bursary', 'merit scholarship',
      'scholarship approve', 'fee refund', 'education loan approved',
      'chhaatravrtti', 'vidyarthi sahayata'],
    description: 'Fake scholarship or education assistance programs designed to steal student information.'
  },
  FEE_REFUND: {
    id: 'FEE_REFUND',
    name: 'College Fee Refund Scam',
    keywords: ['fee refund', 'tuition refund', 'exam fee refund', 'admission refund',
      'college refund', 'university refund', 'fees wapas',
      'refund process', 'refund claim', 'fee vapasi'],
    description: 'Scam claiming fee refunds from educational institutions to steal banking details.'
  },
  UPI_SCAM: {
    id: 'UPI_SCAM',
    name: 'UPI Collect Request Scam',
    keywords: ['upi collect', 'upi request', 'accept request', 'upi payment',
      'phonepe request', 'gpay request', 'paytm request',
      'collect request accept karo', 'upi pin daalo',
      'payment receive karne ke liye'],
    description: 'Fraudulent UPI collect requests disguised as refunds or payments.'
  },
  KYC_SCAM: {
    id: 'KYC_SCAM',
    name: 'Fake KYC Update Alert',
    keywords: ['kyc update', 'kyc verification', 'kyc expired', 'kyc pending',
      'rekyc', 'video kyc', 'e-kyc', 'kyc mandatory',
      'kyc complete karein', 'kyc update karein', 'kyc expire ho gaya'],
    description: 'Fake KYC update requests from banks or payment platforms.'
  },
  BANK_FREEZE: {
    id: 'BANK_FREEZE',
    name: 'Fake Bank Account Freeze Alert',
    keywords: ['account freeze', 'account blocked', 'account suspended',
      'debit card blocked', 'credit card blocked', 'net banking blocked',
      'account band', 'account block ho gaya', 'khata band',
      'account freeze ho jayega'],
    description: 'Threatening messages about bank account suspension to steal credentials.'
  },
  OTP_SIM: {
    id: 'OTP_SIM',
    name: 'OTP/SIM Verification Scam',
    keywords: ['otp verification', 'sim verification', 'sim swap', 'sim upgrade',
      'otp share', 'otp forward', 'verification code',
      'otp bhej do', 'otp bata do', 'sim card upgrade'],
    description: 'Attempts to steal OTP or perform SIM swaps for account takeover.'
  },
  COURIER_SCAM: {
    id: 'COURIER_SCAM',
    name: 'Courier/Customs Delivery Scam',
    keywords: ['courier delivery', 'customs clearance', 'package held',
      'delivery attempt', 'parcel stuck', 'customs duty',
      'delivery failed', 'courier charge', 'parcel aaya hai',
      'customs mein atka hai', 'delivery charge bhare', 'delhi airport',
      'customs officer', 'foreign parcel', 'contraband', 'parcel clearance'],
    description: 'Fake courier or customs notifications demanding payment for package release.'
  },
  GOVT_NOTICE: {
    id: 'GOVT_NOTICE',
    name: 'Fake Government Notice',
    keywords: ['government notice', 'income tax notice', 'police notice',
      'court summon', 'legal notice', 'it department',
      'sarkari notice', 'police se notice', 'court ka notice',
      'challan', 'penalty notice', 'tax refund', 'income tax department'],
    description: 'Fake government or legal notices designed to create fear and urgency.'
  },
  DIGITAL_ARREST: {
    id: 'DIGITAL_ARREST',
    name: 'Digital Arrest/Police Threat',
    keywords: ['digital arrest', 'cyber crime', 'fir filed', 'arrest warrant',
      'police complaint', 'money laundering', 'narcotics',
      'giraftaari', 'arrest ho jayega', 'case darj',
      'cyber cell', 'cbi', 'enforcement directorate', 'pmla'],
    description: 'Threatening calls/messages claiming legal action or digital arrest.'
  },
  LOTTERY_REWARD: {
    id: 'LOTTERY_REWARD',
    name: 'Lottery/Reward/Cashback Scam',
    keywords: ['lottery winner', 'lucky draw', 'cash prize', 'reward points',
      'cashback offer', 'bonus amount', 'gift voucher',
      'lottery jeeta', 'inam jeeta', 'cashback milega',
      'reward claim karo', 'lucky draw winner', 'kbc', 'crorepati', 'lucky customer', '25 lakh', 'spin wheel', 'free iphone'],
    description: 'Fake lottery winnings or reward claims designed to extract payment or data.'
  },
  ELECTRICITY_SCAM: {
    id: 'ELECTRICITY_SCAM',
    name: 'Fake Electricity Bill Disconnection',
    keywords: ['electricity bill', 'power disconnection', 'bill payment due',
      'meter reading', 'bijli bill', 'bijli kat jayegi',
      'electricity disconnect', 'bill overdue', 'bill bhare',
      'disconnection alert', 'power officer', 'electricity disconnection'],
    description: 'Fake utility bill disconnection threats to collect payment via UPI.'
  },
  ECOMMERCE_SCAM: {
    id: 'ECOMMERCE_SCAM',
    name: 'Fake E-commerce Delivery Scam',
    keywords: ['order confirmation', 'delivery update', 'order cancelled',
      'refund initiated', 'return approved', 'order track',
      'flipkart order', 'amazon order', 'myntra order',
      'order cancel ho gaya', 'refund process ho raha hai'],
    description: 'Fake e-commerce notifications about orders, refunds, or deliveries.'
  },
  FAKE_RECRUITER: {
    id: 'FAKE_RECRUITER',
    name: 'Fake Recruiter Scam',
    keywords: ['resume required', 'cv required', 'registration charge',
      'joining fee', 'security deposit', 'training fee',
      'resume bhejo', 'cv send karo', 'registration fee bharo',
      'work from home opportunity', 'part time job', 'telegram', 'daily income', 'earn rs', 'like youtube videos'],
    description: 'Fake recruiters requesting payment or sensitive documents from job seekers.'
  },
  CEO_FRAUD_BEC: {
    id: 'CEO_FRAUD_BEC',
    name: 'Executive / Wire Transfer Impersonation',
    keywords: ['wire transfer', 'acquisition meeting', 'confidential wire', 'urgent transfer', 'vendor payment immediately', 'wire transfer request'],
    description: 'Executive impersonation or Business Email Compromise (BEC) directing urgent wire payments.'
  },
  FREE_RECHARGE: {
    id: 'FREE_RECHARGE',
    name: 'Free Mobile Recharge / 5G Scheme Scam',
    keywords: ['free recharge', 'free data', 'recharge scheme', '5g recharge', 'free 3-month', 'jio recharge', 'airtel recharge', 'pm scheme', '84-day'],
    description: 'Viral message promising free telecom recharge to steal mobile credentials or install malware.'
  }
};

// Hinglish phishing phrases
export const HINGLISH_PHISHING_PHRASES = [
  { phrase: 'aapka bank account block ho jayega', meaning: 'Your bank account will be blocked', risk: 'high' },
  { phrase: 'placement registration ke liye pay karein', meaning: 'Pay for placement registration', risk: 'high' },
  { phrase: 'kyc update karein warna account band', meaning: 'Update KYC or account will close', risk: 'high' },
  { phrase: 'upi collect request accept karo', meaning: 'Accept UPI collect request', risk: 'high' },
  { phrase: 'scholarship approve karne ke liye details verify karein', meaning: 'Verify details to approve scholarship', risk: 'high' },
  { phrase: 'otp share karo verification ke liye', meaning: 'Share OTP for verification', risk: 'critical' },
  { phrase: 'bijli ka bill jama karo nahi to kat jayegi', meaning: 'Pay electricity bill or it will be cut', risk: 'high' },
  { phrase: 'aapka parcel customs mein atka hai', meaning: 'Your parcel is stuck in customs', risk: 'medium' },
  { phrase: 'lottery jeeta hai aapne claim karo', meaning: 'You won lottery, claim it', risk: 'high' },
  { phrase: 'digital arrest ho jayega agar respond nahi kiya', meaning: 'Digital arrest if you dont respond', risk: 'critical' },
  { phrase: 'refund milega upi pin daalo', meaning: 'Enter UPI PIN to get refund', risk: 'critical' },
  { phrase: 'income tax notice aaya hai', meaning: 'Income tax notice received', risk: 'medium' },
  { phrase: 'sim card expire ho raha hai', meaning: 'SIM card is expiring', risk: 'medium' },
  { phrase: 'free mein iphone milega', meaning: 'Get iPhone for free', risk: 'high' },
  { phrase: 'internship ke liye fees bharo', meaning: 'Pay fees for internship', risk: 'high' },
];

// Audience targeting patterns
export const AUDIENCE_PATTERNS = {
  STUDENTS: {
    keywords: ['student', 'college', 'university', 'campus', 'semester', 'exam',
      'internship', 'placement', 'scholarship', 'hostel', 'assignment',
      'vidyarthi', 'chhatra', 'padhai'],
    label: 'College Students'
  },
  JOB_SEEKERS: {
    keywords: ['job', 'career', 'resume', 'cv', 'interview', 'hiring',
      'vacancy', 'recruitment', 'employment', 'salary', 'naukri',
      'rozgar', 'job opening'],
    label: 'Job Seekers'
  },
  BANKING_CUSTOMERS: {
    keywords: ['bank', 'account', 'debit', 'credit', 'loan', 'emi',
      'net banking', 'mobile banking', 'balance', 'statement',
      'khata', 'bachat'],
    label: 'Banking Customers'
  },
  ONLINE_SHOPPERS: {
    keywords: ['order', 'delivery', 'shopping', 'cart', 'checkout',
      'purchase', 'shipping', 'tracking', 'return', 'refund',
      'khareed', 'saman'],
    label: 'Online Shoppers'
  },
  SENIOR_CITIZENS: {
    keywords: ['pension', 'retirement', 'senior citizen', 'elderly',
      'health insurance', 'life insurance', 'savings',
      'pension', 'seva niwritt'],
    label: 'Senior Citizens'
  },
  GENERAL: {
    keywords: [],
    label: 'General Users'
  }
};

export const SECURITY_TIPS = [
  "Never share your OTP, UPI PIN, or banking password with anyone, even if they claim to be from your bank.",
  "Legitimate companies will never ask for your password via email or phone call.",
  "Always verify the sender's email domain before clicking any links.",
  "If a deal seems too good to be true, it probably is. Verify offers through official channels.",
  "Enable two-factor authentication on all your important accounts.",
  "Government agencies never threaten 'digital arrest' — this is always a scam.",
  "Check for HTTPS and a valid SSL certificate before entering any sensitive information.",
  "Be cautious of emails with urgent language demanding immediate action.",
  "Verify internship and job offers through the official company website or placement cell.",
  "Report cyber fraud immediately to India's helpline: 1930 or cybercrime.gov.in",
  "Never pay a 'registration fee' or 'processing fee' for a job offer or scholarship.",
  "Legitimate UPI refunds are credited directly — you never need to enter a PIN to receive money.",
  "Hover over links before clicking to see the actual URL destination.",
  "Banks never send links for KYC updates via SMS or WhatsApp."
];
