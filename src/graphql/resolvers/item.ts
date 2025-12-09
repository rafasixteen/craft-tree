import { Resolvers } from '@generated/graphql/types';
import { GraphQLContext } from '../context';
import { nameSchema } from '@/schemas/common';

export const itemResolvers: Resolvers<GraphQLContext> = {
	Query: {
		item: async (_parent, args, ctx) =>
		{
			return ctx.prisma.item.findUnique({
				where: {
					id: args.id,
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

			const parsedName = await nameSchema.parseAsync(name);

			return ctx.prisma.item.update({
				where: {
					id: id,
				},
				data: {
					name: parsedName,
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
