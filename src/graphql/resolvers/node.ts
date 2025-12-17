import { Resolvers } from '@generated/graphql/types';
import { GraphQLContext } from '../context';
import { createNode, deleteNode, getAscendentNodes, getDescendantNodes, getNode, getRootNodes, updateNode } from '@domain/node';

export const nodeResolvers: Resolvers<GraphQLContext> = {
	Query: {
		node: async (_parent, args, ctx) =>
		{
			const { id } = args;
			return getNode(id);
		},
		rootNodes: async (_parent, _args, ctx) =>
		{
			return getRootNodes();
		},
		descendantNodes: async (_parent, args, ctx) =>
		{
			const { id } = args;
			return getDescendantNodes(id);
		},
		ascendantNodes: async (_parent, args, ctx) =>
		{
			const { id } = args;
			return getAscendentNodes(id);
		},
	},
	Mutation: {
		createNode: async (_parent, args, ctx) =>
		{
			const { data } = args;

			return createNode({
				name: data.name,
				type: data.type,
				parentId: data.parentId!,
				itemId: data.itemId!,
				recipeId: data.recipeId!,
			});
		},
		updateNode: async (_parent, args, ctx) =>
		{
			const { id, data } = args;

			return updateNode(id, {
				name: data.name!,
				parentId: data.parentId!,
			});
		},
		deleteNode: async (_parent, args, ctx) =>
		{
			const { id } = args;
			return deleteNode(id);
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
			return ctx.prisma.node.findMany({
				where: {
					parentId: node.id,
				},
				orderBy: {
					order: 'asc',
				},
			});
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
