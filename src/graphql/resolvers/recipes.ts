import { Resolvers } from '../generated/types';
import { recipesTable, itemsTable, ingredientsTable } from '@/db/schema';
import { slugify } from '@/lib/utils';
import { eq } from 'drizzle-orm';

export const recipeResolvers: Resolvers = {
	Query: {
		recipes: async (_parent, args, ctx) =>
		{
			return await ctx.db.select().from(recipesTable).where(eq(recipesTable.itemId, args.itemId));
		},
	},
	Mutation: {
		createRecipe: async (_parent, args, ctx) =>
		{
			const { name, itemId, quantity, time } = args;

			const slug = slugify(name);

			const [insertedRecipe] = await ctx.db.insert(recipesTable).values({ name, slug, itemId, quantity, time }).returning();

			return insertedRecipe;
		},
		updateRecipe: async (_parent, args, ctx) =>
		{
			const { id, name, quantity, time, ingredients } = args;

			const updateData: Partial<{ name: string; slug: string; quantity: number; time: number }> = {};

			if (name != null)
			{
				updateData.name = name;
				updateData.slug = slugify(name);
			}

			if (quantity != null)
			{
				updateData.quantity = quantity;
			}

			if (time != null)
			{
				updateData.time = time;
			}

			const [updatedRecipe] = await ctx.db.update(recipesTable).set(updateData).where(eq(recipesTable.id, id)).returning();

			if (ingredients && ingredients.length > 0)
			{
				// Assuming you have a recipeIngredients table
				// First, delete existing ingredients
				await ctx.db.delete(ingredientsTable).where(eq(ingredientsTable.recipeId, id));

				// Insert new ingredients
				const newIngredients = ingredients.map((ing) => ({
					...ing,
					recipeId: id,
				}));

				await ctx.db.insert(ingredientsTable).values(newIngredients);
			}

			return updatedRecipe;
		},

		deleteRecipe: async (_parent, args, ctx) =>
		{
			const { id } = args;

			await ctx.db.delete(recipesTable).where(eq(recipesTable.id, id));

			return true;
		},
	},
	Recipe: {
		item: async (parent, _args, ctx) =>
		{
			const item = await ctx.db.select().from(itemsTable).where(eq(itemsTable.id, parent.itemId)).limit(1);
			return item[0];
		},
	},
};
