'use server';

import { usersTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import db from '@/db/client';

export async function getUserIdFromEmail(email: string): Promise<string>
{
	const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
	return user.id;
}
