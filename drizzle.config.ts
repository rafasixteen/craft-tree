import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

dotenvExpand.expand(
	dotenv.config({
		path: ['.env', '.env.development', '.env.production', '.env.local'],
		override: true,
	}),
);

export default defineConfig({
	out: './drizzle',
	schema: './src/db/schema',
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
});
