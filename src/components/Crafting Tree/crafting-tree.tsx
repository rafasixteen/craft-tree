'use client';

import { useState, useCallback, useEffect } from 'react';
import { ReactFlow, addEdge, applyNodeChanges, applyEdgeChanges, type Node, type Edge, type FitViewOptions, type OnNodesChange, type OnEdgesChange, Controls, MiniMap, Background, type DefaultEdgeOptions, OnConnect } from '@xyflow/react';
import { RecipeNode } from './';
import { getItemById } from '@/lib/items';
import '@xyflow/react/dist/style.css';

const nodeTypes = {
	recipeNode: RecipeNode,
};

const fitViewOptions: FitViewOptions = { padding: 0.2 };
const defaultEdgeOptions: DefaultEdgeOptions = { animated: true, type: 'straight' };

interface CraftingTreeProps
{
	itemId: string;
}

// Move buildNodeTree outside the component
async function buildNodeTree(itemId: string, parentNodeId: string | null, depth: number, xOffset: number, nodesArr: Node[], edgesArr: Edge[], onRecipeChanged: (nodeId: string, recipeIndex: number) => Promise<void>)
{
	const item = await getItemById(itemId);
	const nodeId = `${item.id}-${nodesArr.length}`;

	nodesArr.push({
		id: nodeId,
		type: 'recipeNode',
		position: { x: xOffset, y: depth * 300 },
		data: {
			itemId: item.id,
			isRoot: depth === 0,
			currentRecipeIndex: 0,
			onRecipeChanged: (recipeIndex: number) => onRecipeChanged(nodeId, recipeIndex),
		},
	});

	if (parentNodeId)
	{
		edgesArr.push({
			id: `e-${parentNodeId}-${nodeId}`,
			source: parentNodeId,
			target: nodeId,
		});
	}

	const recipe = item.recipes?.[0];
	if (recipe?.ingredients?.length)
	{
		let childX = xOffset - ((recipe.ingredients.length - 1) * 150) / 2;

		for (const ingredient of recipe.ingredients)
		{
			await buildNodeTree(ingredient.item.id, nodeId, depth + 1, childX, nodesArr, edgesArr, onRecipeChanged);
			childX += 150;
		}
	}
}

export default function CraftingTree({ itemId }: CraftingTreeProps)
{
	const [nodes, setNodes] = useState<Node[]>([]);
	const [edges, setEdges] = useState<Edge[]>([]);

	const onNodesChange: OnNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
	const onEdgesChange: OnEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
	const onConnect: OnConnect = useCallback((connection) => setEdges((eds) => addEdge(connection, eds)), []);

	useEffect(() =>
	{
		if (!itemId) return;

		const newNodes: Node[] = [];
		const newEdges: Edge[] = [];

		console.log('Building tree for itemId:', itemId);

		const onRecipeChanged = async (nodeId: string, recipeIndex: number) =>
		{
			// find the node
			const node = nodes.find((n) => n.id === nodeId);
			if (!node) return;

			// remove children
			const childIds = edges.filter((e) => e.source === nodeId).map((e) => e.target);
			setNodes((prev) => prev.filter((n) => !childIds.includes(n.id)));
			setEdges((prev) => prev.filter((e) => e.source !== nodeId));

			// update recipe index
			setNodes((prev) => prev.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, currentRecipeIndex: recipeIndex } } : n)));

			const item = await getItemById(node.data.itemId);
			const recipe = item.recipes?.[recipeIndex];
			if (!recipe?.ingredients?.length) return;

			const newNodes: Node[] = [];
			const newEdges: Edge[] = [];

			let childX = node.position.x - ((recipe.ingredients.length - 1) * 150) / 2;
			const depth = node.position.y / 300 + 1;

			for (const ingredient of recipe.ingredients)
			{
				await buildNodeTree(ingredient.item.id, nodeId, depth, childX, newNodes, newEdges, onRecipeChanged);
				childX += 150;
			}

			setNodes((prev) => [...prev, ...newNodes]);
			setEdges((prev) => [...prev, ...newEdges]);
		};

		buildNodeTree(itemId, null, 0, 0, newNodes, newEdges, onRecipeChanged).then(() =>
		{
			setNodes(newNodes);
			setEdges(newEdges);
		});
	}, [itemId]); // only depends on itemId

	return (
		<div style={{ width: '100%', height: '100%' }}>
			<ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} fitView fitViewOptions={fitViewOptions} defaultEdgeOptions={defaultEdgeOptions}>
				<Controls />
				<MiniMap />
				<Background gap={12} size={1} />
			</ReactFlow>
		</div>
	);
}
