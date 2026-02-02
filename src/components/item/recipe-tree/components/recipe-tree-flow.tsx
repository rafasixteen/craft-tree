'use client';

import '@xyflow/react/dist/style.css';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { RecipeTreeNode, RecipeTreeLeafNode, RecipeTreeEdge } from '@/components/item/recipe-tree/components';
import { RecipeTreeNodeData, RecipeTreeLeafNodeData, RecipeTreeNodeType } from '@/components/item/recipe-tree/types';
import { buildEdge, buildNode, buildLeafNode } from '@/components/item/recipe-tree/utils';
import { getItemById, getRecipes, Item } from '@/domain/item';
import { getRecipeIngredients, Recipe } from '@/domain/recipe';
import { Ingredient } from '@/domain/ingredient';
import { useTreeNodesContext } from '@/providers';
import {
	ReactFlow,
	type Node,
	type Edge,
	type NodeTypes,
	type EdgeTypes,
	type FitViewOptions,
	type DefaultEdgeOptions,
	Controls,
	Background,
	useNodesState,
	useEdgesState,
} from '@xyflow/react';

const nodeTypes: NodeTypes = {
	[RecipeTreeNodeType.NODE]: RecipeTreeNode,
	[RecipeTreeNodeType.LEAF]: RecipeTreeLeafNode,
};

const edgeTypes: EdgeTypes = {
	'flow-edge': RecipeTreeEdge,
};

const fitViewOptions: FitViewOptions = {
	padding: 0.2,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
	animated: false,
	type: 'flow-edge',
};

interface RecipeTreeFlowProps
{
	item: Item;
}

export function RecipeTreeFlow({ item }: RecipeTreeFlowProps)
{
	const { theme } = useTheme();
	const [mounted, setMounted] = useState(false);

	const [nodes, setNodes, onNodesChange] = useNodesState<Node<RecipeTreeNodeData | RecipeTreeLeafNodeData>>([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

	const { nodes: treeNodes } = useTreeNodesContext();

	useEffect(() =>
	{
		setMounted(true);
	}, []);

	useEffect(() =>
	{
		async function buildRecipeTree()
		{
			const nodes: Node<RecipeTreeNodeData | RecipeTreeLeafNodeData>[] = [];
			const edges: Edge[] = [];
			const visited = new Set<string>();

			let nodeIdCounter = 0;

			async function processItem(item: Item, parentNodeId: string | null, recipeIndex: number): Promise<void>
			{
				const itemKey = `${item.id}`;

				if (visited.has(itemKey))
				{
					return;
				}

				visited.add(itemKey);
				const nodeId = `node_${nodeIdCounter++}`;

				// Get recipes for this item
				const recipes = await getRecipes(item.id);

				if (recipes.length === 0)
				{
					// Item has no recipes, create a leaf node
					const leafNode = buildLeafNode({
						nodeId: nodeId,
						data: {
							item: item,
						},
					});

					nodes.push(leafNode);

					if (parentNodeId)
					{
						edges.push(buildEdge(parentNodeId, nodeId));
					}

					return;
				}

				const ingredientsMap: Map<Recipe, Ingredient[]> = new Map();

				for (const recipe of recipes)
				{
					const ingredients = await getRecipeIngredients(recipe.id);
					ingredientsMap.set(recipe, ingredients);
				}

				// Get the selected recipe (bounded by available recipes)
				const selectedRecipeIndex = Math.min(recipeIndex, recipes.length - 1);
				const selectedRecipe = recipes[selectedRecipeIndex];
				const ingredients = ingredientsMap.get(selectedRecipe);

				if (!ingredients)
				{
					throw new Error(`No ingredients found for recipe id: ${selectedRecipe.id}`);
				}

				const node = buildNode({
					nodeId: nodeId,
					data: {
						item: item,
						recipes: recipes,
						ingredientsMap: ingredientsMap,
						selectedRecipeIndex: selectedRecipeIndex,
						isRoot: parentNodeId === null,
					},
				});

				nodes.push(node);

				// Connect to parent
				if (parentNodeId)
				{
					edges.push(buildEdge(parentNodeId, nodeId));
				}

				// Recursively process ingredient items
				for (const ingredient of ingredients)
				{
					const ingredientItem = await getItemById(ingredient.itemId);
					await processItem(ingredientItem, nodeId, 0);
				}
			}

			// Build tree data
			await processItem(item, null, 0);

			// Calculate positions
			calculateTreePositions(nodes, edges);

			setNodes(nodes);
			setEdges(edges);
		}

		function calculateTreePositions(nodes: Node<RecipeTreeNodeData | RecipeTreeLeafNodeData>[], edges: Edge[]): void
		{
			// Build parent-child relationships
			const childrenMap = new Map<string, string[]>();
			edges.forEach((edge) =>
			{
				if (!childrenMap.has(edge.source))
				{
					childrenMap.set(edge.source, []);
				}
				childrenMap.get(edge.source)!.push(edge.target);
			});

			// Calculate tree layout based on node dimensions
			const nodeWidth = 160; // w-40 in Tailwind = 10rem = 160px
			const nodeHeight = 130; // Estimated average height
			const horizontalOffset = 80; // Space between nodes horizontally
			const verticalOffset = 60; // Space between levels

			const horizontalSpacing = nodeWidth + horizontalOffset;
			const verticalSpacing = nodeHeight + verticalOffset;
			const nodeMap = new Map(nodes.map((n) => [n.id, n]));

			// Calculate subtree width for each node (bottom-up)
			function getSubtreeWidth(nodeId: string): number
			{
				const children = childrenMap.get(nodeId) || [];
				if (children.length === 0)
				{
					return 1; // Leaf node has width of 1
				}

				const childWidths = children.map((childId) => getSubtreeWidth(childId));
				return childWidths.reduce((sum, width) => sum + width, 0);
			}

			// Position nodes (top-down, left-to-right)
			function positionNode(nodeId: string, x: number, y: number): void
			{
				const node = nodeMap.get(nodeId);
				if (!node) return;

				node.position = { x, y };

				const children = childrenMap.get(nodeId) || [];
				if (children.length === 0) return;

				// Calculate total width needed for all children
				const childWidths = children.map((childId) => getSubtreeWidth(childId));
				const totalWidth = childWidths.reduce((sum, width) => sum + width, 0);

				// Position children centered under parent
				let currentX = x - ((totalWidth - 1) * horizontalSpacing) / 2;

				children.forEach((childId, index) =>
				{
					const childWidth = childWidths[index];
					const childCenterOffset = ((childWidth - 1) * horizontalSpacing) / 2;

					positionNode(childId, currentX + childCenterOffset, y + verticalSpacing);

					currentX += childWidth * horizontalSpacing;
				});
			}

			// Find root node (node with no incoming edges)
			const rootNode = nodes.find((n) => n.data.isRoot);
			if (rootNode)
			{
				positionNode(rootNode.id, 0, 0);
			}
		}

		buildRecipeTree();
	}, [item, setNodes, setEdges, treeNodes]);

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
				edgeTypes={edgeTypes}
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
