import { redirect } from 'next/navigation';

import { chatGPTSignOutPath, getChatGPTUser } from '@/app/chatgpt-auth';

export type AdminUser = {
  id: string;
  email: string;
  role: 'ADMIN';
};

export async function getAdminUser(): Promise<AdminUser | null> {
  const user = await getChatGPTUser();
  if (!user) return null;

  const allowedIds = new Set(
    (process.env.ADMIN_USER_IDS ?? '')
      .split(',')
      .map(value => value.trim())
      .filter(Boolean),
  );

  if (!allowedIds.has(user.userId)) return null;
  return { id: user.userId, email: user.email, role: 'ADMIN' };
}

export async function logoutAdmin(): Promise<never> {
  redirect(chatGPTSignOutPath('/'));
}

export async function hashPassword(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}
