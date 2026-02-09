// Server-side authentication utilities for the task management application
// This handles server component authentication with cookies

import { cookies } from 'next/headers';

// JWT utility functions for server-side
function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = atob(base64);
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT token:', error);
    return null;
  }
}

// Server-side auth utility functions (for server components)
export const serverAuth = {
  /**
   * Get the current session by checking for valid token
   * @returns Promise resolving to session info or null if not authenticated
   */
  getSession: async () => {
    // First, try to get token from cookies
    const cookieStore = await cookies();
    let token = cookieStore.get('access_token')?.value;

    if (token) {
      const payload = parseJwt(token);
      if (payload) {
        const userId = payload.sub; // 'sub' is the standard JWT field for subject (user ID)

        return {
          user: {
            id: userId,
            email: payload.email || null // if email is in the token
          },
          accessToken: token
        };
      }
    }

    // If no token in cookies, we can't access localStorage from server-side
    // So we return null
    return null;
  }
};

// JWT configuration (7-day expiration as specified)
export const JWT_CONFIG = {
  expiresIn: '7d', // 7 days
  algorithm: 'HS256' as const,
};