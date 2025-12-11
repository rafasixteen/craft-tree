import { Resolvers } from '@generated/graphql/types';
import { GraphQLContext } from '../context';
import { nameSchema } from '@/schemas/common';
import { Node } from '@generated/graphql/types';

export async function withChildren(node: Node, ctx: GraphQLContext): Promise<Node>
{
	const children = await ctx.prisma.node.findMany({
		where: {
			parentId: node.id,
		},
		orderBy: {
			order: 'asc',
		},
	});

	return {
		...node,
		children: children.map((child) => child.id),
	};
}

export const nodeResolvers: Resolvers<GraphQLContext> = {
	Query: {
		nodes: async (_parent, _args, ctx) =>
		{
			const nodes = await ctx.prisma.node.findMany({
				orderBy: {
					order: 'asc',
				},
			});

			return Promise.all(nodes.map((node) => withChildren({ ...node, children: [] }, ctx)));
		},
		node: async (_parent, args, ctx) =>
		{
			const node = await ctx.prisma.node.findUnique({
				where: {
					id: args.id,
				},
			});

			if (node)
			{
				return withChildren({ ...node, children: [] }, ctx);
			}
			else
			{
				return null;
			}
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

			const node = await ctx.prisma.node.create({
				data: {
					name: parsedName,
					type,
					parent: parentId ? { connect: { id: parentId } } : undefined,
					resourceId: resourceId || null,
					order: finalOrder,
				},
			});

			return withChildren({ ...node, children: [] }, ctx);
		},
		updateNode: async (_parent, args, ctx) =>
		{
			const { id, data } = args;
			const { name, parentId, order } = data;

			let parsedName: string | undefined = undefined;
			if (name !== undefined) parsedName = await nameSchema.parseAsync(name);

			const node = await ctx.prisma.node.update({
				where: {
					id,
				},
				data: {
					name: parsedName,
					parent: parentId ? { connect: { id: parentId } } : undefined,
					order: order || undefined,
				},
			});

			return withChildren({ ...node, children: [] }, ctx);
		},
		deleteNode: async (_parent, args, ctx) =>
		{
			const { id } = args;

			const node = await ctx.prisma.node.delete({
				where: {
					id,
				},
			});

			return withChildren({ ...node, children: [] }, ctx);
		},
	},
	Node: {
		children: async (node, _args, ctx) =>
		{
			const children = await ctx.prisma.node.findMany({
				where: {
					parentId: node.id,
				},
				orderBy: {
					order: 'asc',
				},
			});

			return children.map((child) => child.id);
		},
	},
};
