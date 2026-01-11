import { Resolvers } from '../generated/types';
import { itemsTable, recipesTable, collectionsTable } from '@/db/schema';
import { slugify } from '@/lib/utils';
import { eq } from 'drizzle-orm';

export const itemResolvers: Resolvers = {
	Mutation: {
		createItem: async (_parent, args, ctx) =>
		{
			const { name, collectionId } = args;

			const slug = slugify(name);

			const [insertedItem] = await ctx.db.insert(itemsTable).values({ name, slug, collectionId }).returning();

			return insertedItem;
		},
		updateItem: async (_parent, args, ctx) =>
		{
			const { id, name } = args;

			const slug = slugify(name);

			const [updatedItem] = await ctx.db.update(itemsTable).set({ name, slug }).where(eq(itemsTable.id, id)).returning();

			return updatedItem;
		},
		deleteItem: async (_parent, args, ctx) =>
		{
			const { id } = args;

			await ctx.db.delete(itemsTable).where(eq(itemsTable.id, id));

			return true;
		},
	},
	Item: {
		collection: async (parent, _args, ctx) =>
		{
			const collection = await ctx.db.select().from(collectionsTable).where(eq(collectionsTable.id, parent.collectionId)).limit(1);
			return collection[0];
		},
		recipes: async (parent, _args, ctx) =>
		{
			return await ctx.db.select().from(recipesTable).where(eq(recipesTable.itemId, parent.id));
		},
	},
};
