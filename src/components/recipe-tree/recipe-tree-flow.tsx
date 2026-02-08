'use client';

import '@xyflow/react/dist/style.css';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import ELK from 'elkjs/lib/elk.bundled.js';
import { ReactFlow, Controls, Background, useNodesState, useEdgesState, Position } from '@xyflow/react';
import type { Node, Edge, FitViewOptions, DefaultEdgeOptions } from '@xyflow/react';
import { RecipeTreeInternalNode, RecipeTreeRootNode, RecipeTreeLeafNode, RecipeTreeNodeData } from '@/components/recipe-tree';
import { useRecipeTree, RecipeTreeNode } from '@/domain/recipe-tree';

const elk = new ELK();

// Reference: https://eclipse.dev/elk/reference/options.html

const elkOptions = {
	'elk.algorithm': 'layered',
	'elk.direction': 'DOWN',
	'elk.layered.nodePlacement.strategy': 'BRANDES_KOEPF',
	'elk.layered.nodePlacement.bk.fixedAlignment': 'BALANCED',
	'elk.layered.spacing.nodeNodeBetweenLayers': '120',
	'elk.spacing.nodeNode': '80',
};

async function getLayoutedElements(nodes: Node<RecipeTreeNodeData>[], edges: Edge[])
{
	// TODO: We should layout nodes based on their measured size.

	const nodeWidth = 150;
	const nodeHeight = 50;

	const graph = {
		id: 'root',
		layoutOptions: elkOptions,
		children: nodes.map((node) => ({
			...node,
			targetPosition: Position.Top,
			sourcePosition: Position.Bottom,
			width: nodeWidth,
			height: nodeHeight,
		})),
		edges: edges.map((edge) => ({
			id: edge.id,
			sources: [edge.source],
			targets: [edge.target],
		})),
	};

	try
	{
		const layoutedGraph = await elk.layout(graph);
		const layoutedNodes = layoutedGraph.children!.map((node) => ({
			...node,
			position: { x: node.x ?? 0, y: node.y ?? 0 },
		}));

		return { nodes: layoutedNodes, edges };
	}
	catch (error)
	{
		console.error('Layout error:', error);
		return { nodes, edges };
	}
}

type NodeType = 'root-node' | 'internal-node' | 'leaf-node';

const nodeTypes = {
	'root-node': RecipeTreeRootNode,
	'internal-node': RecipeTreeInternalNode,
	'leaf-node': RecipeTreeLeafNode,
} satisfies Record<NodeType, React.ComponentType<any>>;

const fitViewOptions: FitViewOptions = {
	padding: 0.2,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
	animated: false,
	type: 'smoothstep',
};

export function RecipeTreeFlow()
{
	const { theme } = useTheme();
	const [mounted, setMounted] = useState(false);

	const [nodes, setNodes, onNodesChange] = useNodesState<Node<RecipeTreeNodeData>>([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

	const { recipeTree, dfs } = useRecipeTree();

	useEffect(() =>
	{
		if (!recipeTree)
		{
			return;
		}

		const newNodes: Node<RecipeTreeNodeData>[] = [];
		const newEdges: Edge[] = [];

		function getChildren(node: RecipeTreeNode): RecipeTreeNode['id'][]
		{
			// no selected recipe → no children
			if (node.selectedRecipeIndex === -1) return [];

			const recipe = node.recipes[node.selectedRecipeIndex];
			const ingredients = node.ingredients[recipe.id] ?? [];

			if (!node.children || node.children.length === 0)
			{
				return [];
			}

			// Use the tree's child node ids, slicing by recipe order to match the builder.
			let startIndex = 0;

			for (let i = 0; i < node.selectedRecipeIndex; i++)
			{
				const priorRecipe = node.recipes[i];
				startIndex += node.ingredients[priorRecipe.id]?.length ?? 0;
			}

			const endIndex = startIndex + ingredients.length;
			const recipeChildren = node.children.slice(startIndex, endIndex);

			const uniqueChildren = Array.from(new Set(recipeChildren));
			return uniqueChildren;
		}

		function callback(node: RecipeTreeNode): void
		{
			const type: NodeType = node.parentId === null ? 'root-node' : node.recipes.length > 0 ? 'internal-node' : 'leaf-node';

			newNodes.push(buildNode(node, type));

			if (node.parentId)
			{
				newEdges.push(buildEdge(node.parentId, node.id));
			}
		}

		dfs(recipeTree.rootNodeId, callback, getChildren, 'pre');

		getLayoutedElements(newNodes, newEdges).then(({ nodes: layoutedNodes, edges: layoutedEdges }) =>
		{
			setNodes(layoutedNodes);
			setEdges(layoutedEdges);
		});
	}, [recipeTree]);

	useEffect(() =>
	{
		setMounted(true);
	}, []);

	if (!mounted)
	{
		return null;
	}

	return (
		<div style={{ width: '100%', height: '100%' }}>
			<ReactFlow
				nodes={nodes}
				edges={edges}
				nodeTypes={nodeTypes}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				fitView
				fitViewOptions={fitViewOptions}
				defaultEdgeOptions={defaultEdgeOptions}
				colorMode={theme === 'dark' ? 'dark' : 'light'}
			>
				<Controls />
				<Background gap={12} size={1} />
			</ReactFlow>
		</div>
	);
}

function buildNode(node: RecipeTreeNode, type: NodeType): Node<RecipeTreeNodeData>
{
	return {
		id: node.id,
		type: type,
		position: { x: 0, y: 0 },
		data: {
			item: node.item,
			recipes: node.recipes,
			ingredients: node.ingredients,
			selectedRecipeIndex: node.selectedRecipeIndex,
		},
	};
}

function buildEdge(parentId: RecipeTreeNode['id'], childId: RecipeTreeNode['id']): Edge
{
	return {
		id: `edge_${parentId}_${childId}`,
		source: parentId,
		target: childId,
	};
}
