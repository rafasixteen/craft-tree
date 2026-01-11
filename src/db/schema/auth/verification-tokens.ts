import { timestamp, pgTable, text, primaryKey } from 'drizzle-orm/pg-core';

export const verificationTokensTable = pgTable(
	'verificationToken',
	{
		identifier: text('identifier').notNull(),
		token: text('token').notNull(),
		expires: timestamp('expires', { mode: 'date' }).notNull(),
	},
	(verificationToken) => [
		primaryKey({
			columns: [verificationToken.identifier, verificationToken.token],
		}),
	],
);
