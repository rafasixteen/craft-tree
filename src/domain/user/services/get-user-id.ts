'use server';

import { usersTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import db from '@/db/client';

interface GetUserIdParams
{
	email: string;
}

export async function getUserId({ email }: GetUserIdParams): Promise<string | null>
{
	const [user] = await db.select({ id: usersTable.id }).from(usersTable).where(eq(usersTable.email, email)).limit(1);
	return user?.id ?? null;
}
