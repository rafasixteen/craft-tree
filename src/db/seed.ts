import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import { eq } from 'drizzle-orm';
import { usersTable } from '@/db/schema/schema';

type UsersInsert = typeof usersTable.$inferInsert;

const db = drizzle({ connection: { url: process.env.DATABASE_URL! }, casing: 'snake_case' });

async function main()
{
	const user: UsersInsert = {
		name: 'John',
		age: 30,
		email: 'john2@example.com',
	};

	await db.insert(usersTable).values(user);
	console.log('New user created!');

	const users = await db.select().from(usersTable);
	console.log('Getting all users from the database: ', users);

	await db
		.update(usersTable)
		.set({
			age: 31,
		})
		.where(eq(usersTable.email, user.email));
	console.log('User info updated!');
}

main();
