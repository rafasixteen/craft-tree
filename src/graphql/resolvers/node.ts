import { Resolvers, Node, NodeType } from '@generated/graphql/types';
import { GraphQLContext } from '../context';
import { nameSchema } from '@/schemas/common';
import { de } from 'zod/v4/locales';

export const nodeResolvers: Resolvers<GraphQLContext> = {
	Query: {
		nodes: async (_parent, _args, ctx) =>
		{
			return ctx.prisma.node.findMany({
				orderBy: {
					order: 'asc',
				},
				include: {
					parent: true,
					children: true,
				},
			});
		},
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
					parent: true,
					children: true,
				},
			});
		},
		descendantNodes: async (_parent, args, ctx) =>
		{
			const { id } = args;

			const rows = await ctx.prisma.$queryRaw<Node[]>`
				WITH RECURSIVE descendant_nodes AS (
				SELECT * FROM "Nodes" WHERE id = ${id}
				UNION ALL
				SELECT n.* FROM "Nodes" n
				INNER JOIN descendant_nodes dn ON n."parentId" = dn.id
				)
				SELECT * FROM descendant_nodes;
			`;

			const nodesMap = new Map<string, Node>();

			for (const row of rows)
			{
				nodesMap.set(row.id, { ...row, children: [] });
			}

			for (const node of Array.from(nodesMap.values()))
			{
				if (node.parentId && nodesMap.has(node.parentId))
				{
					nodesMap.get(node.parentId)!.children.push(node.id);
				}
			}

			return Array.from(nodesMap.values());
		},
		node: async (_parent, args, ctx) =>
		{
			return ctx.prisma.node.findUnique({
				where: {
					id: args.id,
				},
				include: {
					parent: true,
					children: true,
				},
			});
		},
	},
	Mutation: {
		createNode: async (_parent, args, ctx) =>
		{
			const { name, type, parentId, resourceId } = args.data;

			const siblingCount = await ctx.prisma.node.count({
				where: {
					parentId: parentId || null,
				},
			});

			let order = siblingCount + 1;

			const parsedName = await nameSchema.parseAsync(name);

			return ctx.prisma.node.create({
				data: {
					name: parsedName,
					type,
					parent: parentId ? { connect: { id: parentId } } : undefined,
					resourceId: resourceId,
					order: order,
				},
			});
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

			return node;
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

			return ctx.prisma.node.findUnique({
				where: {
					id: node.parentId,
				},
			});
		},
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
