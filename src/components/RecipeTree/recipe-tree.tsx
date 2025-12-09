'use client';

import { useState, useEffect, useCallback } from 'react';
import { ReactFlow, addEdge, applyNodeChanges, applyEdgeChanges, type Node, type Edge, type OnNodesChange, type OnEdgesChange, Controls, MiniMap, Background, OnConnect } from '@xyflow/react';
import RecipeNode, { RecipeNodeType } from './recipe-node';
import { getItem } from '@/lib/graphql/items';
import '@xyflow/react/dist/style.css';

const nodeTypes = { recipeNode: RecipeNode };

interface RecipeTreeProps
{
	itemId: string;
}

function findNodeById(nodes: RecipeNodeType[], id: string): RecipeNodeType | undefined
{
	return nodes.find((node) => node.id === id);
}

function findEdgeById(edges: Edge[], id: string): Edge | undefined
{
	return edges.find((edge) => edge.id === id);
}

function computeNodeId(itemId: string, depth: number): string
{
	return `${itemId}-${depth}`;
}

function computeEdgeId(sourceNodeId: string, targetNodeId: string): string
{
	return `e-${sourceNodeId}-${targetNodeId}`;
}

async function buildNode(itemId: string, x: number, y: number, depth: number, nodes: RecipeNodeType[], edges: Edge[], visited: Set<string>): Promise<string>
{
	const vericalSpacing = 300;
	const horizontalSpacing = 150;

	const nodeId = computeNodeId(itemId, depth);

	if (visited.has(nodeId))
	{
		throw new Error('Cyclic dependency detected in recipe tree with item id: ' + itemId);
	}

	visited.add(nodeId);

	const item = await getItem(itemId);

	if (!item)
	{
		throw new Error('Item not found with id: ' + itemId);
	}

	const newNode: RecipeNodeType = {
		id: nodeId,
		type: 'recipeNode',
		position: { x, y },
		data: {
			item,
			isRoot: depth === 0,
			currentRecipeIndex: 0,
		},
	};

	nodes.push(newNode);

	const recipe = item.recipes[newNode.data.currentRecipeIndex];

	if (!recipe || !recipe.ingredients || recipe.ingredients.length === 0)
	{
		return nodeId;
	}

	// Compute starting X for children so siblings are centered around parent's x.
	const childCount = recipe.ingredients.length;

	// Total width spanned by children.
	const firstChildX = x - ((childCount - 1) * horizontalSpacing) / 2;

	// For each ingredient, recursively build child node and create an edge.
	let childX = firstChildX;
	const childY = y + vericalSpacing;

	for (const ingredient of recipe.ingredients)
	{
		const childNodeId = await buildNode(ingredient.item.id, childX, childY, depth + 1, nodes, edges, visited);

		edges.push({
			id: computeEdgeId(nodeId, childNodeId),
			source: nodeId,
			target: childNodeId,
		});

		childX += horizontalSpacing;
	}

	return nodeId;
}

export default function RecipeTree({ itemId }: RecipeTreeProps)
{
	const [nodes, setNodes] = useState<RecipeNodeType[]>([]);
	const [edges, setEdges] = useState<Edge[]>([]);

	const onNodesChange: OnNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes as any, nds)), []);
	const onEdgesChange: OnEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
	const onConnect: OnConnect = useCallback((connection) => setEdges((eds) => addEdge(connection, eds)), []);

	useEffect(() =>
	{
		async function buildTree()
		{
			if (!itemId) return;

			const newNodes: RecipeNodeType[] = [];
			const newEdges: Edge[] = [];
			const visited = new Set<string>();

			await buildNode(itemId, 0, 0, 0, newNodes, newEdges, visited);

			setNodes(newNodes);
			setEdges(newEdges);
		}

		buildTree();
	}, [itemId]);

	return (
		<div style={{ width: '100%', height: '100%' }}>
			<ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} fitView>
				<Controls />
				<MiniMap />
				<Background gap={12} size={1} />
			</ReactFlow>
		</div>
	);
}
