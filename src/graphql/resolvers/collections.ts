import { Resolvers } from '../generated/types';
import { collectionsTable, itemsTable } from '@/db/schema';
import { slugify } from '@/lib/utils';
import { eq } from 'drizzle-orm';

export const collectionResolvers: Resolvers = {
	Query: {
		userCollections: async (_parent, args, ctx) =>
		{
			return await ctx.db.select().from(collectionsTable).where(eq(collectionsTable.userId, args.userId));
		},
	},
	Mutation: {
		createCollection: async (_parent, args, ctx) =>
		{
			const { name, userId } = args;

			const slug = slugify(name);

			const [insertedCollection] = await ctx.db.insert(collectionsTable).values({ name, slug, userId }).returning();

			return insertedCollection;
		},

		updateCollection: async (_parent, args, ctx) =>
		{
			const { id, name } = args;

			const slug = slugify(name);

			const [updatedCollection] = await ctx.db.update(collectionsTable).set({ name, slug }).where(eq(collectionsTable.id, id)).returning();

			return updatedCollection;
		},
		deleteCollection: async (_parent, args, ctx) =>
		{
			const { id } = args;

			await ctx.db.delete(collectionsTable).where(eq(collectionsTable.id, id));

			return true;
		},
	},
	Collection: {
		items: async (parent, _args, ctx) =>
		{
			return await ctx.db.select().from(itemsTable).where(eq(itemsTable.collectionId, parent.id));
		},
	},
};
