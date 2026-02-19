'use server';

import { usersTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { User } from '@/domain/user';
import db from '@/db/client';

type FindUserIdByEmailParams = Exclude<User['email'], null>;

export async function findUserIdByEmail(email: FindUserIdByEmailParams): Promise<User['id'] | null>
{
	const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
	return user?.id ?? null;
}
