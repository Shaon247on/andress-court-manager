"use server";

import { cookies } from 'next/headers';
import { encryptEdge, decryptEdge } from './crypto';

// Cookie names
const ACCESS_NAME = 'accessToken';
const REFRESH_NAME = 'refreshToken';
const SESSION_NAME = 'session';
const SESSION_TOKEN_NAME = 'sessionToken';
const RESET_TOKEN_NAME = 'resetToken';
const PERMISSIONS_NAME = 'permissions';

// ============================================================
// MAIN AUTH COOKIES
// ============================================================

export async function setAuthCookies(payload: { 
  access_token: string; 
  refresh_token: string; 
  user: any;
  permissions?: any;
}) {
  const jar = await cookies();
  const maxAge = 60 * 60 * 24 * 7; // 7 days

  // Store COMPLETE user data including all fields from login response
  const userData = {
    id: payload.user.id,
    email: payload.user.email,
    full_name: payload.user.full_name,
    role: payload.user.role,
    role_label: payload.user.role_label || payload.user.role_name || 'User',
    role_name: payload.user.role_name || payload.user.role_label || 'User',
    status: payload.user.status || 'active',
    is_staff_member: payload.user.is_staff_member || false,
  };

  console.log('📦 Storing user data in session:', userData);

  // Access Token
  jar.set({
    name: ACCESS_NAME,
    value: await encryptEdge(payload.access_token),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge,
  });

  // Refresh Token
  jar.set({
    name: REFRESH_NAME,
    value: await encryptEdge(payload.refresh_token),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: maxAge * 4, // 28 days
  });

  // Session (COMPLETE user data)
  jar.set({
    name: SESSION_NAME,
    value: await encryptEdge(JSON.stringify(userData)),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge,
  });

  // ── Store permissions with proper logging ──
  const permissions = payload.permissions || {};
  console.log('📦 Storing permissions:', permissions);
  
  jar.set({
    name: PERMISSIONS_NAME,
    value: await encryptEdge(JSON.stringify(permissions)),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge,
  });
}

// ============================================================
// GETTERS
// ============================================================

export async function getSession() {
  const jar = await cookies();
  const c = jar.get(SESSION_NAME)?.value;
  if (!c) return null;
  
  try {
    const dec = await decryptEdge(c);
    if (!dec) return null;
    const sessionData = JSON.parse(dec);
    return sessionData;
  } catch (error) {
    console.error('Error decrypting session:', error);
    return null;
  }
}

export async function getAccessToken(): Promise<string | null> {
  const jar = await cookies();
  const c = jar.get(ACCESS_NAME)?.value;
  if (!c) return null;
  
  try {
    return await decryptEdge(c) || null;
  } catch (error) {
    console.error('Error decrypting access token:', error);
    return null;
  }
}

export async function getRefreshToken(): Promise<string | null> {
  const jar = await cookies();
  const c = jar.get(REFRESH_NAME)?.value;
  if (!c) return null;
  
  try {
    return await decryptEdge(c) || null;
  } catch (error) {
    console.error('Error decrypting refresh token:', error);
    return null;
  }
}

export async function getPermissions() {
  const jar = await cookies();
  const c = jar.get(PERMISSIONS_NAME)?.value;
  if (!c) {
    console.log('🔑 No permissions cookie found');
    return null;
  }
  
  try {
    const dec = await decryptEdge(c);
    if (!dec) {
      console.log('🔑 Failed to decrypt permissions');
      return null;
    }
    const permissions = JSON.parse(dec);
    console.log('🔑 Retrieved permissions:', permissions);
    return permissions;
  } catch (error) {
    console.error('Error decrypting permissions:', error);
    return null;
  }
}
export async function getUserId(): Promise<string | null> {
  const session = await getSession();
  return session?.id || null;
}

export async function getUserRoleLabel(): Promise<string | null> {
  const session = await getSession();
  return session?.role_label || null;
}

export async function getUserRole(): Promise<string | null> {
  const session = await getSession();
  return session?.role || null;
}

// ============================================================
// SESSION UPDATES
// ============================================================

/**
 * Update the entire session with new user data
 * This replaces the existing session data
 */
export async function updateSession(userData: any) {
  const jar = await cookies();
  const maxAge = 60 * 60 * 24 * 7;
  
  // Get existing session to preserve fields that might not be in the update
  const currentSession = await getSession();
  
  // Merge existing session with new data, but ensure required fields are preserved
  const updatedSession = {
    id: userData.id || currentSession?.id,
    email: userData.email || currentSession?.email,
    full_name: userData.full_name || currentSession?.full_name,
    role: userData.role || currentSession?.role,
    role_label: userData.role_label || currentSession?.role_label || 'User',
    role_name: userData.role_name || currentSession?.role_name || 'User',
    status: userData.status || currentSession?.status || 'active',
    is_staff_member: userData.is_staff_member !== undefined ? userData.is_staff_member : (currentSession?.is_staff_member || false),
    ...userData, // Override with any new data
  };
  
  console.log('🔄 Updating session with:', updatedSession);
  
  jar.set({
    name: SESSION_NAME,
    value: await encryptEdge(JSON.stringify(updatedSession)),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge,
  });
}

/**
 * Update specific user fields in the session
 * This merges the new data with existing session data
 */
export async function updateSessionUser(userData: Partial<any>) {
  const jar = await cookies();
  const maxAge = 60 * 60 * 24 * 7;
  
  const currentSession = await getSession();
  if (!currentSession) return;
  
  const updatedSession = {
    ...currentSession,
    ...userData,
  };
  
  console.log('🔄 Updating session user data:', userData);
  console.log('📦 New session data:', updatedSession);
  
  jar.set({
    name: SESSION_NAME,
    value: await encryptEdge(JSON.stringify(updatedSession)),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge,
  });
}

export async function updatePermissions(permissions: any) {
  const jar = await cookies();
  const maxAge = 60 * 60 * 24 * 7;
  
  jar.set({
    name: PERMISSIONS_NAME,
    value: await encryptEdge(JSON.stringify(permissions || {})),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge,
  });
}

// ============================================================
// SESSION TOKEN (for OTP/Password Reset)
// ============================================================

export async function setSessionToken(token: string) {
  const jar = await cookies();
  jar.set({
    name: SESSION_TOKEN_NAME,
    value: await encryptEdge(token),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 10, // 10 minutes
  });
}

export async function getSessionToken(): Promise<string | null> {
  const jar = await cookies();
  const value = jar.get(SESSION_TOKEN_NAME)?.value;
  if (!value) return null;
  
  try {
    return await decryptEdge(value) || null;
  } catch (error) {
    console.error('Error decrypting session token:', error);
    return null;
  }
}

export async function clearSessionToken() {
  const jar = await cookies();
  jar.set({ name: SESSION_TOKEN_NAME, value: '', path: '/', maxAge: 0 });
}

// ============================================================
// RESET TOKEN (for Password Reset)
// ============================================================

export async function setResetToken(token: string) {
  const jar = await cookies();
  jar.set({
    name: RESET_TOKEN_NAME,
    value: await encryptEdge(token),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 10, // 10 minutes
  });
}

export async function getResetToken(): Promise<string | null> {
  const jar = await cookies();
  const value = jar.get(RESET_TOKEN_NAME)?.value;
  if (!value) return null;
  
  try {
    return await decryptEdge(value) || null;
  } catch (error) {
    console.error('Error decrypting reset token:', error);
    return null;
  }
}

export async function clearResetToken() {
  const jar = await cookies();
  jar.set({ name: RESET_TOKEN_NAME, value: '', path: '/', maxAge: 0 });
}

// ============================================================
// CLEAR COOKIES
// ============================================================

export async function clearAuthCookies() {
  const jar = await cookies();
  jar.set({ name: ACCESS_NAME, value: '', path: '/', maxAge: 0 });
  jar.set({ name: REFRESH_NAME, value: '', path: '/', maxAge: 0 });
  jar.set({ name: SESSION_NAME, value: '', path: '/', maxAge: 0 });
  jar.set({ name: SESSION_TOKEN_NAME, value: '', path: '/', maxAge: 0 });
  jar.set({ name: RESET_TOKEN_NAME, value: '', path: '/', maxAge: 0 });
  jar.set({ name: PERMISSIONS_NAME, value: '', path: '/', maxAge: 0 });
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  const accessToken = await getAccessToken();
  return !!session?.id && !!accessToken;
}

export async function getSessionData() {
  const [session, permissions, accessToken, refreshToken] = await Promise.all([
    getSession(),
    getPermissions(),
    getAccessToken(),
    getRefreshToken(),
  ]);

  return {
    user: session,
    permissions,
    accessToken,
    refreshToken,
    isAuthenticated: !!session?.id && !!accessToken,
  };
}