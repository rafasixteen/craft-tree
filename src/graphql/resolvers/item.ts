import { Resolvers } from '@generated/graphql/types';
import { GraphQLContext } from '../context';

export const itemResolvers: Resolvers<GraphQLContext> = {
	Query: {
		item: async (_parent, args, ctx) =>
		{
			return ctx.prisma.item.findUnique({
				where: {
					id: args.id,
				},
				include: {
					recipes: {
						include: {
							item: true,
							ingredients: {
								include: {
									item: true,
								},
							},
						},
					},
				},
			});
		},
	},

	Mutation: {
		createItem: async (_parent, args, ctx) =>
		{
			return ctx.prisma.item.create({
				data: args.data,
			});
		},
		updateItem: async (_parent, args, ctx) =>
		{
			const { id, data } = args;

			return ctx.prisma.item.update({
				where: { id },
				data: data,
			});
		},
		deleteItem: async (_parent, args, ctx) =>
		{
			return ctx.prisma.item.delete({
				where: {
					id: args.id,
				},
			});
		},
	},
};
