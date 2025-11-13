import { headers, cookies } from 'next/headers';
import { getLocale } from 'next-intl/server';
import type {
  ApiResponse,
  AuthUser,
} from '@/types';
import { SESSION_TOKEN_COOKIE_NAME, SESSION_EXPIRATION_MS } from '@/constants/auth.constants';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

export type SessionData = {
  user: {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
    emailVerified: boolean;
  };
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
  };
};

export async function getSession(): Promise<SessionData | null> {
  const headersList = await headers();
  const cookieStore = await cookies();
  
  // Get session token from cookie or header
  const sessionToken = 
    cookieStore.get(SESSION_TOKEN_COOKIE_NAME)?.value ||
    headersList.get('authorization')?.replace('Bearer ', '');

  if (!sessionToken) {
    return null;
  }

  try {
    // Get current locale for Accept-Language header
    const locale = await getLocale();
    
    // Verify session with backend
    const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
        'Cookie': cookieStore.toString(),
        'Accept-Language': locale,
      },
      credentials: 'include',
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const result = (await response.json()) as ApiResponse<{
      user: AuthUser;
    }>;
    
    if (!result.data?.user) {
      return null;
    }

    const user = result.data.user;
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.first_name
          ? `${user.first_name} ${user.last_name || ''}`.trim()
          : null,
        image: user.avatar_url || null,
        emailVerified: user.email_verified,
      },
      session: {
        id: sessionToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + SESSION_EXPIRATION_MS),
      },
    };
  } catch (error) {
    console.error('Session verification error:', error);
    return null;
  }
}

export async function getServerSession() {
  return await getSession();
}

export async function requireAuth() {
  const session = await getSession();
  
  if (!session) {
    throw new Error('Unauthorized');
  }

  return session;
}
