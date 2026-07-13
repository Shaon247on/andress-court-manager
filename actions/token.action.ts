// actions/token.action.ts

"use server";

import { getAccessToken } from "@/lib/cookies";

export async function getDecryptedAccessToken(): Promise<string | null> {
  return await getAccessToken();
}