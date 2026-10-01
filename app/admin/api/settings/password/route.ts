import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser, hashPassword } from '@/lib/admin-auth';
import { db } from '@/lib/server';

export async function POST(req: NextRequest) {
  try {
    const user = await getAdminUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { currentPassword, newPassword } = (await req.json()) as { currentPassword?: string; newPassword?: string; };

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Both current and new password are required' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 });
    }

    const sql = db();
    if (!sql) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    // Verify current password
    const currentHash = await hashPassword(currentPassword);
    const userRows = await sql`SELECT password_hash FROM users WHERE id=${user.id}`;
    if (userRows.length === 0 || userRows[0].password_hash !== currentHash) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 403 });
    }

    // Update password
    const newHash = await hashPassword(newPassword);
    await sql`UPDATE users SET password_hash=${newHash} WHERE id=${user.id}`;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Password change error:', error);
    return NextResponse.json({ error: 'Failed to change password' }, { status: 500 });
  }
}
