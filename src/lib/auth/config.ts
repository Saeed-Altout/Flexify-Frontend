import { betterAuth } from 'better-auth';
import { adapter } from './adapter';

export const auth = betterAuth({
  database: adapter,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001',
  basePath: '/api/auth',
  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001',
    process.env.BACKEND_URL || 'http://localhost:3000',
  ],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;

