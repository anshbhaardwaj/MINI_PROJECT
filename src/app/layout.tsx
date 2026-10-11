import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'PhishGuard AI — Intelligent Phishing Detection & BharatShield Scam DNA',
  description: 'AI-assisted, explainable phishing detection engine with BharatShield Scam DNA analysis and Human-in-the-Loop Analyst Verification.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} dark h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0b0f17] text-slate-100 font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
        <AuthProvider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#111827',
                color: '#f1f5f9',
                border: '1px solid #1e293b',
                borderRadius: '0.75rem',
                fontSize: '0.875rem',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
