import { Resolvers } from '@generated/graphql/types';
import { GraphQLContext } from '../context';
import { nameSchema } from '@/schemas/common';

export const itemResolvers: Resolvers<GraphQLContext> = {
	Query: {
		itemById: async (_parent, args, ctx) =>
		{
			return ctx.prisma.item.findUnique({
				where: {
					id: args.id,
				},
			});
		},
		itemBySlug: async (_parent, args, ctx) =>
		{
			return ctx.prisma.item.findUnique({
				where: {
					slug: args.slug,
				},
			});
		},
	},

	Mutation: {
		createItem: async (_parent, args, ctx) =>
		{
			const { name } = args.data;

			const parsedName = await nameSchema.parseAsync(name);

			return ctx.prisma.item.create({
				data: {
					name: parsedName,
				},
			});
		},
		updateItem: async (_parent, args, ctx) =>
		{
			const { id, data } = args;
			const { name } = data;

			const parsedName = name ? await nameSchema.parseAsync(name) : undefined;

			return ctx.prisma.item.update({
				where: {
					id: id,
				},
				data: {
					name: parsedName ?? undefined,
				},
			});
		},
		deleteItem: async (_parent, args, ctx) =>
		{
			const { id } = args;

			return ctx.prisma.item.delete({
				where: {
					id: id,
				},
			});
		},
	},
};
