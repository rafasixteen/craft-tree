import NextAuth from 'next-auth';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import authConfig from '@/../auth.config';
import database from '@/db/client';

export const { auth, handlers, signIn, signOut } = NextAuth({
	...authConfig,
	adapter: DrizzleAdapter(database),
	session: { strategy: 'jwt' },
	pages: {
		signIn: '/sign-in',
		error: '/sign-in',
	},
});
