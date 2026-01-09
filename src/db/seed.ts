import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { usersTable } from '@/db/schema';
import database from '@/db/client';

type UsersInsert = typeof usersTable.$inferInsert;

async function main()
{
	const user: UsersInsert = {
		name: 'John',
		age: 30,
		email: 'john20@example.com',
	};

	await database.insert(usersTable).values(user);
	console.log('New user created!');

	const users = await database.select().from(usersTable);
	console.log('Getting all users from the database: ', users);

	await database
		.update(usersTable)
		.set({
			age: 31,
		})
		.where(eq(usersTable.email, user.email));
	console.log('User info updated!');
}

main();
