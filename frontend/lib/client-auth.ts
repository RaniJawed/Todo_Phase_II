// Client-side authentication utilities for the task management application
// This handles client component authentication with browser APIs

import { login as apiLogin, register as apiRegister, getCurrentUser } from './api';

// Client-side auth utility functions (for client components)
export const clientAuth = {
  /**
   * Sign in a user with email and password
   * @param email User's email address
   * @param password User's password
   * @returns Promise resolving to login result
   */
  signIn: async (email: string, password: string) => {
    return await apiLogin({ email, password });
  },

  /**
   * Sign out the current user
   * @returns Promise resolving to sign out result
   */
  signOut: async () => {
    try {
      // Clear the access token from localStorage
      localStorage.removeItem('access_token');
      // Also clear the access token cookie by setting max-age to 0
      document.cookie = 'access_token=; Max-Age=0; path=/';
      return { success: true };
    } catch (_error) {
      return { success: false, error: 'Failed to sign out' };
    }
  },

  /**
   * Sign up a new user
   * @param email User's email address
   * @param password User's password
   * @returns Promise resolving to registration result
   */
  signUp: async (email: string, password: string) => {
    return await apiRegister({ email, password });
  },

  /**
   * Get the current session by checking for valid token
   * @returns Promise resolving to session info or null if not authenticated
   */
  getSession: async () => {
    // Check if we have a token in localStorage
    const token = localStorage.getItem('access_token');
    if (!token) {
      return null;
    }
    
    // Make a request to our /me endpoint to check if we're authenticated
    try {
      const result = await getCurrentUser();
      
      if (result && result.success && result.data) {
        return {
          user: {
            id: result.data.user_id,
            email: result.data.email
          },
          accessToken: token
        };
      }
    } catch (error) {
      console.error('Error checking session:', error);
    }

    // If the request failed, clear the invalid token
    localStorage.removeItem('access_token');
    return null;
  }
};

// JWT configuration (7-day expiration as specified)
export const JWT_CONFIG = {
  expiresIn: '7d', // 7 days
  algorithm: 'HS256' as const,
};