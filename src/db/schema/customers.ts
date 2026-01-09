import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const customersTable = sqliteTable('customers_table', {
	id: int().primaryKey({ autoIncrement: true }),
	fullName: text().notNull(),
	phoneNumber: text().notNull().unique(),
});
