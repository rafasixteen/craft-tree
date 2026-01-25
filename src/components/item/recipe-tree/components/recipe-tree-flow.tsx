'use client';

import { useState, useCallback, useMemo } from 'react';
import { ReactFlow, Node, Edge, Background, Controls, MiniMap, useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Item } from '@/domain/item';
import { Ingredient } from '@/domain/ingredient';
import { Recipe } from '@/domain/recipe';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RecipeTree, RecipeTreeNode } from '../utils/recipe-tree';
import { RecipeFlowNode, RecipeFlowNodeData } from './recipe-flow-node';

interface RecipeTreeFlowProps
{
	item: Item;
	quantity?: number;
	allRecipes: Map<string, Recipe[]>;
	allIngredients: Map<string, Ingredient[]>;
	allItems: Map<string, Item>;
}

const nodeTypes = {
	recipeNode: RecipeFlowNode,
};

export function RecipeTreeFlow({ item, quantity = 1, allRecipes, allIngredients, allItems }: RecipeTreeFlowProps)
{
	const [treeInstance] = useState(() => new RecipeTree(item, quantity, allRecipes, allIngredients, allItems));
	const [treeResult, setTreeResult] = useState(() => treeInstance.build());

	const handleRecipeChange = useCallback(
		(itemId: string, recipeIndex: number) =>
		{
			const newResult = treeInstance.updateRecipeSelection(itemId, recipeIndex);
			setTreeResult(newResult);
		},
		[treeInstance],
	);

	// Convert tree structure to ReactFlow nodes and edges
	const { nodes, edges } = useMemo(() =>
	{
		const nodesList: Node<RecipeFlowNodeData>[] = [];
		const edgesList: Edge[] = [];
		let nodeIdCounter = 0;

		const processNode = (treeNode: RecipeTreeNode, parentId: string | null, xOffset: number, yOffset: number): string =>
		{
			const nodeId = `node-${nodeIdCounter++}`;
			const availableRecipes = treeInstance.getRecipesForItem(treeNode.item.id).length;

			// Add node
			nodesList.push({
				id: nodeId,
				type: 'recipeNode',
				position: { x: xOffset, y: yOffset },
				data: {
					node: treeNode,
					availableRecipes,
					onRecipeChange: handleRecipeChange,
				},
			});

			// Add edge from parent
			if (parentId)
			{
				edgesList.push({
					id: `edge-${parentId}-${nodeId}`,
					source: parentId,
					target: nodeId,
					animated: true,
					style: { stroke: 'hsl(var(--primary))' },
				});
			}

			// Process children
			if (treeNode.children.length > 0)
			{
				const childSpacing = 300; // Horizontal space between child nodes
				const childYOffset = yOffset + 200; // Vertical space between levels
				const totalChildWidth = (treeNode.children.length - 1) * childSpacing;
				let childXOffset = xOffset - totalChildWidth / 2;

				treeNode.children.forEach((childNode) =>
				{
					processNode(childNode, nodeId, childXOffset, childYOffset);
					childXOffset += childSpacing;
				});
			}

			return nodeId;
		};

		processNode(treeResult.root, null, 400, 0);

		return { nodes: nodesList, edges: edgesList };
	}, [treeResult, treeInstance, handleRecipeChange]);

	const [nodesState, , onNodesChange] = useNodesState(nodes);
	const [edgesState, , onEdgesChange] = useEdgesState(edges);

	const totalCostItems = Array.from(treeResult.totalCost.values()).sort((a, b) => a.item.name.localeCompare(b.item.name));
	const leftoverItems = Array.from(treeResult.leftovers.values()).sort((a, b) => a.item.name.localeCompare(b.item.name));

	return (
		<div className="w-full space-y-6">
			{/* Recipe Tree Visualization */}
			<Card>
				<CardHeader>
					<CardTitle>Crafting Tree</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="h-150 w-full bg-muted/20 rounded-lg">
						<ReactFlow
							nodes={nodesState}
							edges={edgesState}
							onNodesChange={onNodesChange}
							onEdgesChange={onEdgesChange}
							nodeTypes={nodeTypes}
							fitView
							minZoom={0.1}
							maxZoom={2}
						>
							<Background />
							<Controls />
							<MiniMap />
						</ReactFlow>
					</div>
				</CardContent>
			</Card>

			{/* Total Cost and Leftovers */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{/* Total Cost */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<span className="text-xl">🔍</span>
							Total Cost
						</CardTitle>
					</CardHeader>
					<CardContent>
						{totalCostItems.length > 0 ? (
							<div className="space-y-2">
								{totalCostItems.map(({ item: costItem, quantity: qty }) => (
									<div key={costItem.id} className="flex items-center gap-2 p-2 rounded bg-muted/50">
										<div className="w-6 h-6 bg-background rounded border flex items-center justify-center text-xs font-mono">
											{costItem.name.substring(0, 1).toUpperCase()}
										</div>
										<span className="text-sm flex-1">{costItem.name}</span>
										<span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-mono font-bold">{qty}</span>
									</div>
								))}
							</div>
						) : (
							<p className="text-sm text-muted-foreground">No items needed</p>
						)}
					</CardContent>
				</Card>

				{/* Leftovers */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<span className="text-xl">📦</span>
							Leftovers
						</CardTitle>
					</CardHeader>
					<CardContent>
						{leftoverItems.length > 0 ? (
							<div className="space-y-2">
								{leftoverItems.map(({ item: leftoverItem, quantity: qty }) => (
									<div key={leftoverItem.id} className="flex items-center gap-2 p-2 rounded bg-yellow-50 dark:bg-yellow-950">
										<div className="w-6 h-6 bg-background rounded border flex items-center justify-center text-xs font-mono">
											{leftoverItem.name.substring(0, 1).toUpperCase()}
										</div>
										<span className="text-sm flex-1">{leftoverItem.name}</span>
										<span className="text-xs bg-yellow-200 dark:bg-yellow-800 px-2 py-1 rounded font-mono font-bold">{qty}</span>
									</div>
								))}
							</div>
						) : (
							<p className="text-sm text-muted-foreground">No leftovers</p>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
