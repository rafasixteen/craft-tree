import { drizzle } from 'drizzle-orm/libsql';

export default drizzle({ connection: { url: process.env.DATABASE_URL! }, casing: 'snake_case' });
