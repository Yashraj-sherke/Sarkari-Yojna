'use server';
import { loginAdmin } from '@/lib/admin-auth';

export async function handleLogin(email: string, password: string) {
  return await loginAdmin(email, password);
}
