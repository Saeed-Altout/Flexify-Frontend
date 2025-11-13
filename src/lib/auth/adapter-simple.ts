// Simplified adapter that directly uses backend API
// This is used server-side only for Better Auth compatibility

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

export async function getBackendUser(userId: string) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/user/${userId}`, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    return result.data?.user || null;
  } catch {
    return null;
  }
}

export async function getBackendUserByEmail(email: string) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/user/email/${email}`, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    return result.data?.user || null;
  } catch {
    return null;
  }
}

