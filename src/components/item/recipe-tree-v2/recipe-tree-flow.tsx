'use client';

import '@xyflow/react/dist/style.css';
import { useState, useEffect } from 'react';
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
import { useTheme } from 'next-themes';
import { RecipeTreeNodeV2, RecipeTreeEdgeV2, RecipeTreeNodeData } from '@/components/item/recipe-tree-v2';
import { Item } from '@/domain/item';

const initialNodes: Node<RecipeTreeNodeData>[] = [];

const initialEdges: Edge[] = [];

const nodeTypes: NodeTypes = {
	'flow-node': RecipeTreeNodeV2,
};

const edgeTypes: EdgeTypes = {
	'flow-edge': RecipeTreeEdgeV2,
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

export function RecipeTreeFlowV2({ item }: RecipeTreeFlowProps)
{
	const { theme } = useTheme();
	const [mounted, setMounted] = useState(false);

	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

	useEffect(() =>
	{
		setMounted(true);
	}, []);

	useEffect(() =>
	{
		setNodes((nds) => nds.concat(buildNode(item.id, { x: 0, y: 0 })));
	}, [item]);

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

export function buildNode(itemId: string, position = { x: 0, y: 0 }): Node<RecipeTreeNodeData>
{
	return {
		id: itemId,
		type: 'flow-node',
		data: { itemId: itemId, recipeIndex: 0 },
		position,
	};
}
