# Server-Side Authentication Integration

This authentication system is **100% server-side** for maximum security, following Next.js 16 best practices.

## Architecture Overview

### Next.js 16 Proxy Pattern

- **`proxy.ts`**: Handles routing and i18n only (replaces deprecated `middleware.ts`)
- **No auth checks in proxy**: Security checks happen in Data Access Layer
- **Node.js runtime**: Proxy runs on Node.js (not Edge)

### Data Access Layer (Server Components/Actions)

- **`lib/auth/server.ts`**: Server-side session utilities
- **`lib/auth/actions.ts`**: Server actions for all auth operations
- **Layouts/Pages**: Auth checks in server components

### Backend Integration

- All auth operations call NestJS backend API
- Session tokens stored in HttpOnly cookies
- Backend returns tokens in response body for server actions

## Key Files

### `proxy.ts`

- Handles internationalization routing
- Does NOT perform authentication checks
- Runs on Node.js runtime

### `lib/auth/server.ts`

- `getSession()`: Verifies session with backend
- `requireAuth()`: Throws if not authenticated
- Used in server components for auth checks

### `lib/auth/actions.ts`

- `signIn()`: Server action for login
- `signUp()`: Server action for registration
- `signOut()`: Server action for logout
- `forgotPassword()`: Server action for password reset
- `resetPassword()`: Server action for password reset
- `verifyAccount()`: Server action for email verification
- `sendVerificationCode()`: Server action to send verification code

### `lib/auth/config.ts`

- Better Auth configuration (for API routes)
- Custom adapter connects to NestJS backend

### `lib/auth/adapter.ts`

- Custom Better Auth adapter
- Maps Better Auth calls to NestJS backend API

## Usage Examples

### Protected Server Component

```typescript
import { getSession } from "@/lib/auth/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  return <div>Welcome {session.user.email}</div>;
}
```

### Protected Layout

```typescript
import { getSession } from "@/lib/auth/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/auth/login");
  }
  return <>{children}</>;
}
```

### Server Action in Form

```typescript
"use client";

import { signIn } from "@/lib/auth/actions";
import { useState } from "react";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (email: string, password: string) => {
    setIsLoading(true);
    const result = await signIn(email, password);

    if (result.error) {
      // Show error
      return;
    }

    // Success - redirect happens automatically
    router.push("/dashboard");
  };
}
```

## Security Features

1. **Server-Side Only**: No client-side auth logic
2. **HttpOnly Cookies**: Session tokens in HttpOnly cookies
3. **Data Access Layer**: Auth checks close to data source
4. **Server Actions**: All operations are server-side
5. **Backend Verification**: Every request verifies session with backend

## Environment Variables

```env
BACKEND_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3001
BETTER_AUTH_SECRET=your-secret-key (optional)
BETTER_AUTH_URL=http://localhost:3001 (optional)
```

## Migration from Middleware

- ✅ Removed `middleware.ts` (deprecated in Next.js 16)
- ✅ Created `proxy.ts` (Next.js 16 pattern)
- ✅ Moved auth checks to Data Access Layer
- ✅ All operations use server actions
- ✅ No Edge runtime dependencies
