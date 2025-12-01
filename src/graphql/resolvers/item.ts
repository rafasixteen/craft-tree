import { Resolvers } from '@/graphql/generated/graphql';
import { GraphQLContext } from '../context';

export const itemResolvers: Resolvers<GraphQLContext> = {
	Query: {
		items: async (_parent, args, ctx) =>
		{
			const { skip, take, search } = args;
			const hardLimit = 96;

			return ctx.prisma.item.findMany({
				where: search ? { name: { contains: search, mode: 'insensitive' } } : undefined,
				orderBy: { name: 'asc' },
				skip,
				take: Math.min(take, hardLimit),
			});
		},
		itemById: async (_parent, args, ctx) =>
		{
			return ctx.prisma.item.findUnique({
				where: { id: args.id },
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
		itemByName: async (_parent, args, ctx) =>
		{
			return ctx.prisma.item.findUnique({
				where: { name: args.name },
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
			return ctx.prisma.item.create({ data: args.data });
		},
		updateItem: async (_parent, args, ctx) =>
		{
			return ctx.prisma.item.update({
				where: { id: args.data.id },
				data: { name: args.data.name },
			});
		},
		deleteItem: async (_parent, args, ctx) =>
		{
			return ctx.prisma.item.delete({ where: { id: args.id } });
		},
	},
};
