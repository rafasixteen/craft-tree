'use server';

import { usersTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { User } from '@/domain/user';
import db from '@/db/client';

type FindUserIdByEmailParams = Exclude<User['email'], null>;

export async function getUserIdByEmail(email: FindUserIdByEmailParams): Promise<User['id']>
{
	const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
	return user.id;
}
