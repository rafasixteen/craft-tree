import { Resolvers } from '@generated/graphql/types';
import { GraphQLContext } from '../context';
import { createItem, deleteItem, getItemById, getItemBySlug, updateItem } from '@domain/item';

export const itemResolvers: Resolvers<GraphQLContext> = {
	Query: {
		itemById: async (_parent, args, ctx) =>
		{
			const { id } = args;
			return getItemById(id);
		},
		itemBySlug: async (_parent, args, ctx) =>
		{
			const { slug } = args;
			return getItemBySlug(slug);
		},
	},
	Mutation: {
		createItem: async (_parent, args, ctx) =>
		{
			return createItem(args.data);
		},
		updateItem: async (_parent, args, ctx) =>
		{
			const { id, data } = args;

			return updateItem(id, {
				name: data.name!,
			});
		},
		deleteItem: async (_parent, args, ctx) =>
		{
			const { id } = args;
			return deleteItem(id);
		},
	},
};
