import Discord from 'next-auth/providers/discord';
import Google from 'next-auth/providers/google';
import type { NextAuthConfig } from 'next-auth';

const discordProvider = Discord({
	clientId: process.env.AUTH_DISCORD_ID!,
	clientSecret: process.env.AUTH_DISCORD_SECRET!,
});

const googleProvider = Google({
	clientId: process.env.AUTH_GOOGLE_ID!,
	clientSecret: process.env.AUTH_GOOGLE_SECRET!,
});

export default { providers: [discordProvider, googleProvider] } satisfies NextAuthConfig;
