import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;

if (!connectionString)
{
	throw new Error('DATABASE_URL environment variable is not set');
}

const client = postgres(connectionString, {
	prepare: false,
});

export default drizzle({
	client,
	casing: 'snake_case',
});
