import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(100)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const urlAnalysisSchema = z.object({
  url: z.string()
    .min(4, 'URL is too short')
    .max(2048, 'URL is too long')
    .refine(val => {
      try {
        const urlToTest = val.match(/^https?:\/\//) ? val : `http://${val}`;
        new URL(urlToTest);
        return true;
      } catch {
        return false;
      }
    }, 'Please enter a valid URL'),
});

export const emailAnalysisSchema = z.object({
  sender: z.string().email('Please enter a valid sender email').max(320),
  subject: z.string().min(1, 'Subject is required').max(500),
  body: z.string().min(10, 'Email body must be at least 10 characters').max(50000),
  headers: z.string().max(10000).optional(),
});

export const reviewSchema = z.object({
  scanId: z.string().min(1),
  decision: z.enum(['VERIFIED_THREAT', 'FALSE_POSITIVE', 'APPROVED_SAFE', 'ESCALATED']),
  notes: z.string().max(1000).optional(),
  finalClassification: z.enum(['SAFE', 'SUSPICIOUS', 'HIGH_RISK', 'CRITICAL']),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type URLAnalysisInput = z.infer<typeof urlAnalysisSchema>;
export type EmailAnalysisInput = z.infer<typeof emailAnalysisSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
