# Frontend Environment Variables

Copy this content to your `.env.local` file and fill in your actual values.

## Required Variables

```env
# Application Configuration
NODE_ENV=development

# Public URLs (Exposed to Browser)
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000

# Server-Side Only Variables
BACKEND_URL=http://localhost:3000
```

## Optional Variables

```env
# Better Auth Configuration (Optional)
# BETTER_AUTH_SECRET=your_better_auth_secret_key
# BETTER_AUTH_URL=http://localhost:3001
```

## Variable Descriptions

### Application Configuration
- **NODE_ENV**: Node environment (`development`, `production`, or `test`)

### Public URLs (Exposed to Browser)
⚠️ **Warning**: Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Only use for values that are safe to expose publicly.

- **NEXT_PUBLIC_APP_URL**: Frontend application URL
  - Used for generating absolute URLs and Better Auth configuration
  - Example: `http://localhost:3001` or `https://yourdomain.com`

- **NEXT_PUBLIC_BACKEND_URL**: Backend API URL (public)
  - Used by client-side code to make API requests
  - Example: `http://localhost:3000` or `https://api.yourdomain.com`

### Server-Side Only Variables
These variables are **NOT** exposed to the browser and are only available in:
- Server Components
- Server Actions
- API Routes
- Middleware/Proxy

- **BACKEND_URL**: Backend API URL (server-side only)
  - Used in server components and server actions
  - Can be different from `NEXT_PUBLIC_BACKEND_URL` if needed
  - Example: `http://localhost:3000` or `http://backend:3000` (internal network)

### Better Auth Configuration (Optional)
- **BETTER_AUTH_SECRET**: Secret key for Better Auth library
  - Generate with: `openssl rand -base64 32`
  - Only needed if using Better Auth features that require it

- **BETTER_AUTH_URL**: Better Auth base URL
  - Usually same as `NEXT_PUBLIC_APP_URL`

## Development Notes

- Use `.env.local` for local development (gitignored by default)
- Use `.env.production` for production builds
- `NEXT_PUBLIC_` variables are bundled into the client-side code
- Server-side variables (without `NEXT_PUBLIC_`) are only available server-side

## Security Notes

- Never commit `.env.local` or `.env` files to version control
- Never put secrets in `NEXT_PUBLIC_` variables
- Use environment-specific values for different environments
- Consider using a secrets management service in production
- `BACKEND_URL` can use internal network addresses in production (e.g., `http://backend:3000`) for better security

