import type { User, Session } from "better-auth/types";

// Use NEXT_PUBLIC_ prefix for client-side environment variables
const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.BACKEND_URL ||
  "http://localhost:3000";

// Custom adapter that connects to NestJS backend
// This implements the Better Auth adapter interface
export const adapter = {
  async createUser(data: {
    email: string;
    password: string;
    name?: string | null;
    emailVerified?: boolean;
    image?: string | null;
  }) {
    const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        first_name: data.name?.split(" ")[0],
        last_name: data.name?.split(" ").slice(1).join(" "),
      }),
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create user");
    }

    const result = await response.json();
    return {
      id: result.data.user.id,
      email: result.data.user.email,
      emailVerified: result.data.user.email_verified,
      name: result.data.user.first_name
        ? `${result.data.user.first_name} ${
            result.data.user.last_name || ""
          }`.trim()
        : null,
      image: result.data.user.avatar_url || null,
      createdAt: new Date(result.data.user.created_at),
      updatedAt: new Date(
        result.data.user.updated_at || result.data.user.created_at
      ),
    } as User;
  },

  async getUser(id: string) {
    const response = await fetch(`${BACKEND_URL}/api/auth/user/${id}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    if (!result.data?.user) return null;

    const user = result.data.user;
    return {
      id: user.id,
      email: user.email,
      emailVerified: user.email_verified,
      name: user.first_name
        ? `${user.first_name} ${user.last_name || ""}`.trim()
        : null,
      image: user.avatar_url || null,
      createdAt: new Date(user.created_at),
      updatedAt: new Date(user.updated_at || user.created_at),
    } as User;
  },

  async getUserByEmail(email: string) {
    const response = await fetch(
      `${BACKEND_URL}/api/auth/user/email/${email}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    if (!result.data?.user) return null;

    const user = result.data.user;
    return {
      id: user.id,
      email: user.email,
      emailVerified: user.email_verified,
      name: user.first_name
        ? `${user.first_name} ${user.last_name || ""}`.trim()
        : null,
      image: user.avatar_url || null,
      createdAt: new Date(user.created_at),
      updatedAt: new Date(user.updated_at || user.created_at),
    } as User;
  },

  async updateUser(
    userId: string,
    data: {
      email?: string;
      name?: string | null;
      image?: string | null;
      emailVerified?: boolean;
    }
  ) {
    // Map Better Auth format to backend format
    const nameParts = data.name?.split(" ") || [];
    const updateData: Record<string, unknown> = {};
    if (data.email) updateData.email = data.email;
    if (data.name) {
      updateData.first_name = nameParts[0] || null;
      updateData.last_name = nameParts.slice(1).join(" ") || null;
    }
    if (data.image !== undefined) updateData.avatar_url = data.image;
    if (data.emailVerified !== undefined)
      updateData.email_verified = data.emailVerified;

    const response = await fetch(`${BACKEND_URL}/api/auth/user/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update user");
    }

    const result = await response.json();
    const user = result.data.user;
    return {
      id: user.id,
      email: user.email,
      emailVerified: user.email_verified,
      name: user.first_name
        ? `${user.first_name} ${user.last_name || ""}`.trim()
        : null,
      image: user.avatar_url || null,
      createdAt: new Date(user.created_at),
      updatedAt: new Date(user.updated_at || user.created_at),
    } as User;
  },

  async deleteUser(userId: string) {
    const response = await fetch(`${BACKEND_URL}/api/auth/user/${userId}`, {
      method: "DELETE",
      credentials: "include",
    });

    return response.ok;
  },

  async createSession(data: {
    sessionToken: string;
    userId: string;
    expiresAt: Date;
    ipAddress?: string | null;
    userAgent?: string | null;
  }) {
    // Session is created by backend on login
    // Return the session data as provided
    return {
      id: data.sessionToken,
      userId: data.userId,
      expiresAt: data.expiresAt,
      token: data.sessionToken,
      ipAddress: data.ipAddress || null,
      userAgent: data.userAgent || null,
    } as Session;
  },

  async getSession(sessionToken: string) {
    const response = await fetch(`${BACKEND_URL}/api/auth/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    if (!result.data?.user) return null;

    const user = result.data.user;
    return {
      id: sessionToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      token: sessionToken,
      ipAddress: null,
      userAgent: null,
    } as Session;
  },

  async getSessionAndUser(sessionToken: string) {
    const session = await this.getSession(sessionToken);
    if (!session) return null;

    const user = await this.getUser(session.userId);
    if (!user) return null;

    return { session, user };
  },

  async updateSession(
    sessionToken: string,
    data: {
      expiresAt?: Date;
      ipAddress?: string | null;
      userAgent?: string | null;
    }
  ) {
    // Backend handles session updates automatically
    // Data parameter is available but backend manages sessions internally
    void data; // Mark as intentionally unused
    return await this.getSession(sessionToken);
  },

  async deleteSession(sessionToken: string) {
    const response = await fetch(`${BACKEND_URL}/api/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
      credentials: "include",
    });

    return response.ok;
  },

  async createVerificationToken(data: {
    identifier: string;
    token: string;
    expiresAt: Date;
  }) {
    // Backend handles verification tokens
    return {
      id: crypto.randomUUID(),
      identifier: data.identifier,
      token: data.token,
      expiresAt: data.expiresAt,
    };
  },

  async useVerificationToken(token: string) {
    // Note: This method is called by Better Auth but our backend
    // requires both email and code. This is a limitation of the adapter.
    // In practice, verification should be handled through our custom actions.
    const response = await fetch(`${BACKEND_URL}/api/auth/verify-account`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: token,
        email: "", // This is a limitation - email should be passed separately
      }),
      credentials: "include",
    });

    return response.ok;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any; // Type assertion - Better Auth adapter interface (custom implementation)
