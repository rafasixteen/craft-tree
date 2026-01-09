import db from '@/db/client';
import { auth } from '@/auth';
import type { Session } from 'next-auth';

export interface GraphQLContext
{
	db: typeof db;
	session: Session | null;
}

export async function createContext(): Promise<GraphQLContext>
{
	const session = await auth();
	return { db, session };
}
