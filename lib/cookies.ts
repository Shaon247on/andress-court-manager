// lib/cookies.ts

"use server";

import { cookies } from 'next/headers';
import { decrypt, encrypt } from './crypto';

const ACCESS_NAME = 'accessToken';
const REFRESH_NAME = 'refreshToken';
const SESSION_NAME = 'session';
const SESSION_TOKEN_NAME = 'sessionToken';
const RESET_TOKEN_NAME = 'resetToken';
const PERMISSIONS_NAME = 'permissions';

export async function setAuthCookies(payload: { 
  access_token: string; 
  refresh_token: string; 
  user: any;
  permissions?: any;
}) {
  const jar = await cookies();
  const maxAge = 60 * 60 * 24 * 7; // 7 days

  jar.set({
    name: ACCESS_NAME,
    value: encrypt(payload.access_token),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge,
  });

  jar.set({
    name: REFRESH_NAME,
    value: encrypt(payload.refresh_token),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: maxAge * 4,
  });

  jar.set({
    name: SESSION_NAME,
    value: encrypt(JSON.stringify(payload.user || {})),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge,
  });

  if (payload.permissions) {
    jar.set({
      name: PERMISSIONS_NAME,
      value: encrypt(JSON.stringify(payload.permissions || {})),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge,
    });
  }
}

// ── UPDATE session (for profile updates) ──────────────────────────────────

export async function updateSession(userData: any) {
  const jar = await cookies();
  const maxAge = 60 * 60 * 24 * 7; // 7 days

  // Get existing session to preserve permissions
  const existingSession = await getSession();
  const permissions = existingSession?.permissions || {};

  // Merge the new user data with existing data
  const updatedUser = {
    ...existingSession,
    ...userData,
    permissions: permissions, // Preserve permissions
  };

  jar.set({
    name: SESSION_NAME,
    value: encrypt(JSON.stringify(updatedUser)),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge,
  });
}

export async function clearAuthCookies() {
  const jar = await cookies();
  jar.set({ name: ACCESS_NAME, value: '', path: '/', maxAge: 0 });
  jar.set({ name: REFRESH_NAME, value: '', path: '/', maxAge: 0 });
  jar.set({ name: SESSION_NAME, value: '', path: '/', maxAge: 0 });
  jar.set({ name: SESSION_TOKEN_NAME, value: '', path: '/', maxAge: 0 });
  jar.set({ name: RESET_TOKEN_NAME, value: '', path: '/', maxAge: 0 });
  jar.set({ name: PERMISSIONS_NAME, value: '', path: '/', maxAge: 0 });
}

export async function getSession() {
  const jar = await cookies();
  const c = jar.get(SESSION_NAME)?.value;
  if (!c) return null;
  try {
    const dec = decrypt(c);
    return JSON.parse(dec || '{}');
  } catch {
    return null;
  }
}

export async function getPermissions() {
  const jar = await cookies();
  const c = jar.get(PERMISSIONS_NAME)?.value;
  if (!c) return null;
  try {
    const dec = decrypt(c);
    return JSON.parse(dec || '{}');
  } catch {
    return null;
  }
}

export async function getAccessToken(): Promise<string | null> {
  const jar = await cookies();
  const c = jar.get(ACCESS_NAME)?.value;
  if (!c) return null;
  return decrypt(c) || null;
}

export async function setSessionToken(token: string) {
  const jar = await cookies();
  jar.set({
    name: SESSION_TOKEN_NAME,
    value: encrypt(token),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 5,
  });
}

export async function getSessionToken(): Promise<string | null> {
  const jar = await cookies();
  const value = jar.get(SESSION_TOKEN_NAME)?.value;
  if (!value) return null;
  return decrypt(value) || null;
}

export async function setResetToken(token: string) {
  const jar = await cookies();
  jar.set({
    name: RESET_TOKEN_NAME,
    value: encrypt(token),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 5,
  });
}

export async function getResetToken(): Promise<string | null> {
  const jar = await cookies();
  const value = jar.get(RESET_TOKEN_NAME)?.value;
  if (!value) return null;
  return decrypt(value) || null;
}