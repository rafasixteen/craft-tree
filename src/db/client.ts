import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';

export default drizzle({
	connection: process.env.DATABASE_URL!,
	casing: 'snake_case',
});
