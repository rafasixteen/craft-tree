'use client';

import '@xyflow/react/dist/style.css';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { ReactFlow, Controls, Background, useNodesState, useEdgesState, Position, useNodesInitialized, useReactFlow } from '@xyflow/react';
import type { Node, Edge, FitViewOptions, DefaultEdgeOptions } from '@xyflow/react';
import { RecipeTreeInternalNode, RecipeTreeRootNode, RecipeTreeLeafNode, RecipeTreeNodeData } from '@/components/recipe-tree';
import { useRecipeTree, RecipeTreeNode } from '@/domain/recipe-tree';
import ELK from 'elkjs/lib/elk.bundled.js';

const elk = new ELK();

// Reference: https://eclipse.dev/elk/reference/options.html

const elkOptions = {
	'elk.algorithm': 'layered',
	'elk.direction': 'DOWN',
	'elk.layered.nodePlacement.strategy': 'BRANDES_KOEPF',
	'elk.layered.considerModelOrder': 'true',
	'elk.layered.crossingMinimization.forceNodeModelOrder': 'true',
	'elk.layered.nodePlacement.bk.fixedAlignment': 'BALANCED',
	'elk.layered.spacing.nodeNodeBetweenLayers': '60',
	'elk.spacing.nodeNode': '50',
};

async function getLayoutedElements(nodes: Node<RecipeTreeNodeData>[], edges: Edge[])
{
	function getNodeWidth(node: Node<RecipeTreeNodeData>): number
	{
		if (!node.measured)
		{
			throw new Error(`Node ${node.id} is not measured yet.`);
		}

		if (!node.measured.width)
		{
			throw new Error(`Node ${node.id} has no measured width.`);
		}

		return node.measured.width;
	}

	function getNodeHeight(node: Node<RecipeTreeNodeData>): number
	{
		if (!node.measured)
		{
			throw new Error(`Node ${node.id} is not measured yet.`);
		}

		if (!node.measured.height)
		{
			throw new Error(`Node ${node.id} has no measured height.`);
		}

		return node.measured.height;
	}

	const graph = {
		id: 'root',
		layoutOptions: elkOptions,
		children: nodes.map((node) => ({
			...node,
			targetPosition: Position.Top,
			sourcePosition: Position.Bottom,
			width: getNodeWidth(node),
			height: getNodeHeight(node),
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

		const rootNode = layoutedGraph.children!.find((node) =>
		{
			const hasIncomingEdge = edges.some((edge) => edge.target === node.id);
			return !hasIncomingEdge;
		});

		if (!rootNode)
		{
			throw new Error('Root node not found in layouted graph.');
		}

		if (rootNode.x === undefined || rootNode.y === undefined)
		{
			throw new Error('Root node has undefined position.');
		}

		const offsetX = rootNode.x;
		const offsetY = rootNode.y;

		const layoutedNodes = layoutedGraph.children!.map((node) => ({
			...node,
			position: {
				x: node.x! - offsetX,
				y: node.y! - offsetY,
			},
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

	const { getNodes, getEdges } = useReactFlow<Node<RecipeTreeNodeData>, Edge>();
	const nodesInitialized = useNodesInitialized();
	const { recipeTree, dfs } = useRecipeTree();

	useEffect(() =>
	{
		if (nodesInitialized)
		{
			getLayoutedElements(getNodes(), getEdges()).then(({ nodes: layoutedNodes, edges: layoutedEdges }) =>
			{
				setNodes(layoutedNodes);
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

		const newNodes: Node<RecipeTreeNodeData>[] = [];
		const newEdges: Edge[] = [];

		function callback(node: RecipeTreeNode): void
		{
			const type: NodeType = node.parentId === null ? 'root-node' : node.recipes.length > 0 ? 'internal-node' : 'leaf-node';

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

		dfs(recipeTree.rootNodeId, callback, getSelectedRecipeChildren, 'pre');

		setNodes((prev) =>
		{
			// TODO: Maybe add a more robust way to check if the nodes have changed. For example, we could check if the node ids and their selected recipe ids are the same.
			//If the nodes have not changed, keep the same node objects to preserve their position and avoid flashing.
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
				nodesDraggable={false}
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
