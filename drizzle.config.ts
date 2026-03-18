import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import { defineConfig } from 'drizzle-kit';

dotenvExpand.expand(
	dotenv.config({
		path: ['.env', '.env.local'],
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
