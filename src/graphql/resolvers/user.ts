import { Resolvers } from '../generated/types';
import { usersTable } from '@/db/schema';

export const userResolvers: Resolvers = {
	Query: {
		users: async (_, __, ctx) =>
		{
			const users = await ctx.db.select().from(usersTable);
			return users;
		},
	},
};
