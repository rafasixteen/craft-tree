import { Resolvers } from '@generated/graphql/types';
import { GraphQLContext } from '../context';
import { nameSchema } from '@/schemas/common';

export const nodeResolvers: Resolvers<GraphQLContext> = {
	Query: {
		rootNodes: async (_parent, _args, ctx) =>
		{
			return ctx.prisma.node.findMany({
				where: {
					parentId: null,
				},
				orderBy: {
					order: 'asc',
				},
				include: {
					children: true,
					parent: true,
				},
			});
		},
		node: async (_parent, args, ctx) =>
		{
			return ctx.prisma.node.findUnique({
				where: {
					id: args.id,
				},
				include: {
					children: true,
					parent: true,
				},
			});
		},
	},
	Mutation: {
		createNode: async (_parent, args, ctx) =>
		{
			const { name, type, parentId, resourceId, order } = args.data;

			let finalOrder = order;

			if (finalOrder === undefined || finalOrder === null)
			{
				const siblingCount = await ctx.prisma.node.count({
					where: {
						parentId: parentId || null,
					},
				});

				finalOrder = siblingCount + 1;
			}

			const parsedName = await nameSchema.parseAsync(name);

			return ctx.prisma.node.create({
				data: {
					name: parsedName,
					type: type,
					parent: parentId ? { connect: { id: parentId } } : undefined,
					resourceId: resourceId || null,
					order: finalOrder,
				},
				include: {
					children: true,
					parent: true,
				},
			});
		},
		updateNode: async (_parent, args, ctx) =>
		{
			const { id, data } = args;
			const { name, parentId, order } = data;

			let parsedName: string | undefined = undefined;
			if (name !== undefined) parsedName = await nameSchema.parseAsync(name);

			return ctx.prisma.node.update({
				where: {
					id,
				},
				data: {
					name: parsedName,
					parent: parentId ? { connect: { id: parentId } } : undefined,
					order: order || undefined,
				},
				include: {
					children: true,
					parent: true,
				},
			});
		},
		deleteNode: async (_parent, args, ctx) =>
		{
			const { id } = args;

			return ctx.prisma.node.delete({
				where: {
					id,
				},
			});
		},
	},
	Node: {
		parent: async (node, _args, ctx) =>
		{
			if (!node.parentId) return null;
			return ctx.prisma.node.findUnique({ where: { id: node.parentId } });
		},
		children: async (node, _args, ctx) =>
		{
			return ctx.prisma.node.findMany({
				where: {
					parentId: node.id,
				},
				orderBy: {
					order: 'asc',
				},
			});
		},
	},
};
