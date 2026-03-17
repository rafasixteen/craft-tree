import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;

if (!connectionString)
{
	throw new Error('DATABASE_URL environment variable is not set');
}

const globalForDb = globalThis as unknown as { client: postgres.Sql };

const client =
	globalForDb.client ??
	postgres(connectionString, {
		prepare: false,
	});

if (process.env.NODE_ENV !== 'production')
{
	globalForDb.client = client;
}

export default drizzle({
	client: client,
	casing: 'snake_case',
});
