import { Resolvers, Node } from '@generated/graphql/types';
import { GraphQLContext } from '../context';
import { nameSchema } from '@/schemas/common';

export const nodeResolvers: Resolvers<GraphQLContext> = {
	Query: {
		node: async (_parent, args, ctx) =>
		{
			const node = await ctx.prisma.node.findUnique({
				where: {
					id: args.id,
				},
				include: {
					parent: {
						include: {
							children: true,
						},
					},
					children: {
						orderBy: {
							order: 'asc',
						},
					},
					item: true,
					recipe: true,
				},
			});

			if (!node) return null;

			return { ...node, children: node.children.map((child) => child.id) };
		},
		nodes: async (_parent, _args, ctx) =>
		{
			const nodes = await ctx.prisma.node.findMany({
				orderBy: {
					order: 'asc',
				},
				include: {
					parent: true,
					children: {
						orderBy: {
							order: 'asc',
						},
					},
					item: true,
					recipe: true,
				},
			});

			return nodes.map((node) => ({
				...node,
				children: node.children.map((child) => child.id),
			}));
		},
		rootNodes: async (_parent, _args, ctx) =>
		{
			const nodes = await ctx.prisma.node.findMany({
				where: {
					parentId: null,
				},
				orderBy: {
					order: 'asc',
				},
				include: {
					children: {
						orderBy: {
							order: 'asc',
						},
					},
				},
			});

			return nodes.map((node) => ({
				...node,
				children: node.children.map((child) => child.id),
			}));
		},
		descendantNodes: async (_parent, args, ctx) =>
		{
			interface TreeNode extends Node
			{
				parentId?: string;
				itemId?: string;
				recipeId?: string;
			}

			const { id } = args;

			const rows = await ctx.prisma.$queryRaw<TreeNode[]>`
				WITH RECURSIVE descendant_nodes AS (
				SELECT * FROM "Nodes" WHERE id = ${id}
				UNION ALL
				SELECT n.* FROM "Nodes" n
				INNER JOIN descendant_nodes dn ON n."parentId" = dn.id
				)
				SELECT * FROM descendant_nodes;
			`;

			const nodesMap = new Map<string, TreeNode>();

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
	},
	Mutation: {
		createNode: async (_parent, args, ctx) =>
		{
			const { name, type, parentId, itemId, recipeId } = args.data;

			if (itemId && recipeId)
			{
				throw new Error('A node can only reference either an Item or a Recipe, not both.');
			}

			return ctx.prisma.node.create({
				data: {
					name: await nameSchema.parseAsync(name),
					type,
					parent: parentId ? { connect: { id: parentId } } : undefined,
					item: itemId ? { connect: { id: itemId } } : undefined,
					recipe: recipeId ? { connect: { id: recipeId } } : undefined,
					order: await getOrder(),
				},
				include: {
					parent: true,
					children: true,
					item: true,
					recipe: true,
				},
			});

			async function getOrder()
			{
				const siblingCount = await ctx.prisma.node.count({
					where: {
						parentId: parentId || null,
					},
				});

				return siblingCount + 1;
			}
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
		item: async (node, _args, ctx) =>
		{
			if (node.itemId === null) return null;

			return ctx.prisma.item.findUnique({
				where: {
					id: node.itemId,
				},
			});
		},
		recipe: async (node, _args, ctx) =>
		{
			if (node.recipeId === null) return null;

			return ctx.prisma.recipe.findUnique({
				where: {
					id: node.recipeId,
				},
			});
		},
	},
};
