import { timestamp, pgTable, text } from 'drizzle-orm/pg-core';
import { usersTable } from './users';

export const sessionsTable = pgTable('session', {
	sessionToken: text('sessionToken').primaryKey(),
	userId: text('userId')
		.notNull()
		.references(() => usersTable.id, { onDelete: 'cascade' }),
	expires: timestamp('expires', { mode: 'date' }).notNull(),
});
