'use client';

import '@xyflow/react/dist/style.css';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { ReactFlow, Controls, Background, useNodesState, useEdgesState, useNodesInitialized, useReactFlow } from '@xyflow/react';
import type { Node, Edge, FitViewOptions, DefaultEdgeOptions } from '@xyflow/react';
import type { NodeType, ProcessedMaterialNodeData } from '@/components/recipe-tree';
import { ProcessedMaterialNode, RawMaterialNode, RateControlNode, BillOfMaterialsOverlay, getLayoutedElements } from '@/components/recipe-tree';
import { useRecipeTree, RecipeTreeNode, RecipeTreeState } from '@/domain/recipe-tree';

const nodeTypes = {
	'rate-control': RateControlNode,
	'processed-material': ProcessedMaterialNode,
	'raw-material': RawMaterialNode,
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

	const [nodes, setNodes, onNodesChange] = useNodesState<Node<ProcessedMaterialNodeData>>([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

	const { getNodes, getEdges } = useReactFlow<Node<ProcessedMaterialNodeData>, Edge>();

	const nodesInitialized = useNodesInitialized();

	const { recipeTree, dfs } = useRecipeTree();

	useEffect(() =>
	{
		if (nodesInitialized)
		{
			getLayoutedElements(getNodes(), getEdges()).then(({ nodes: layoutedNodes, edges: layoutedEdges }) =>
			{
				setNodes(layoutedNodes as Node<ProcessedMaterialNodeData>[]);
				setEdges(layoutedEdges);
			});
		}
	}, [nodesInitialized]);

	useEffect(() =>
	{
		if (!recipeTree)
		{
			return;
		}

		const newNodes: Node<ProcessedMaterialNodeData>[] = [];
		const newEdges: Edge[] = [];

		function callback(node: RecipeTreeNode): void
		{
			const type: NodeType = node.recipes.length > 0 ? 'processed-material' : 'raw-material';

			newNodes.push(buildNode(node, type));

			if (node.parentId)
			{
				newEdges.push(buildEdge(node.parentId, node.id));
			}
		}

		function getSelectedRecipeChildren(node: RecipeTreeNode): RecipeTreeNode['id'][]
		{
			if (node.selectedRecipeId === null)
			{
				return [];
			}
			else
			{
				return node.children[node.selectedRecipeId];
			}
		}

		const rateControlNodeId = 'rate-control-root';
		newNodes.push(buildRateControlNode(rateControlNodeId) as Node<ProcessedMaterialNodeData>);
		newEdges.push(buildRateControlEdge(rateControlNodeId, recipeTree.rootNodeId));

		dfs(recipeTree.rootNodeId, callback, getSelectedRecipeChildren, 'pre');

		setNodes((prev) =>
		{
			// TODO: Maybe use a more robust way to check if nodes have not changed.
			if (prev.length === newNodes.length && prev.every((prevNode, index) => prevNode.id === newNodes[index].id))
			{
				return prev;
			}
			return newNodes;
		});
		setEdges(newEdges);
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
		<div className="size-full">
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
				nodesDraggable={false}
				deleteKeyCode={null}
			>
				<BillOfMaterialsOverlay />
				<Controls />
				<Background gap={12} size={1} />
			</ReactFlow>
		</div>
	);
}

function buildNode(node: RecipeTreeNode, type: NodeType): Node<ProcessedMaterialNodeData>
{
	return {
		id: node.id,
		type: type,
		position: { x: 0, y: 0 },
		data: {
			item: node.item,
			recipes: node.recipes,
			ingredients: node.ingredients,
			selectedRecipeId: node.selectedRecipeId,
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

function buildRateControlNode(nodeId: string): Node
{
	return {
		id: nodeId,
		type: 'rate-control',
		position: { x: 0, y: 0 },
		data: {},
	};
}

function buildRateControlEdge(rateControlId: Node['id'], rootId: RecipeTreeNode['id']): Edge
{
	return {
		id: `edge_${rateControlId}_${rootId}`,
		source: rateControlId,
		target: rootId,
	};
}
