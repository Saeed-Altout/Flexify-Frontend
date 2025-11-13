/**
 * Authentication Constants
 * 
 * Centralized constants for authentication-related values.
 * This ensures consistency across the application.
 */

/**
 * Cookie name for session token
 * Used for storing authentication session tokens in HTTP-only cookies
 * Must match the backend constant: SESSION_TOKEN_COOKIE_NAME
 */
export const SESSION_TOKEN_COOKIE_NAME = 'NEXT_FLEXIFY_SESSION_TOKEN';

/**
 * Session expiration time in milliseconds
 * Default: 7 days
 * Must match the backend constant: SESSION_EXPIRATION_MS
 */
export const SESSION_EXPIRATION_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Session expiration time in seconds
 * Default: 7 days
 * Must match the backend constant: SESSION_EXPIRATION_SECONDS
 */
export const SESSION_EXPIRATION_SECONDS = 7 * 24 * 60 * 60;

