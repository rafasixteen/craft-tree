'use client';

import { useState, useCallback, useMemo } from 'react';
import { ReactFlow, Node, Edge, Background, Controls, MiniMap, useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Item } from '@/domain/item';
import { Ingredient } from '@/domain/ingredient';
import { Recipe } from '@/domain/recipe';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RecipeTree, RecipeTreeNode } from '@/components/item/recipe-tree';
import { ProductionCalculator } from '../utils';
import { ProductionFlowNode, ProductionFlowNodeData } from './production-flow-node';

interface ProductionFlowReactProps
{
	item: Item;
	allRecipes: Map<string, Recipe[]>;
	allIngredients: Map<string, Ingredient[]>;
	allItems: Map<string, Item>;
}

const nodeTypes = {
	productionNode: ProductionFlowNode,
};

export function ProductionFlowReact({ item, allRecipes, allIngredients, allItems }: ProductionFlowReactProps)
{
	const [targetRate, setTargetRate] = useState(20); // units per minute

	const [recipeTree, calculator, productionRequirements] = useMemo(() =>
	{
		const tree = new RecipeTree(item, 1, allRecipes, allIngredients, allItems);
		const calc = new ProductionCalculator(tree, targetRate, allRecipes, allIngredients, allItems);
		const reqs = calc.calculateProductionRequirements();
		return [tree, calc, reqs];
	}, [item, targetRate, allRecipes, allIngredients, allItems]);

	const handleRecipeChange = useCallback(
		(itemId: string, recipeIndex: number) =>
		{
			recipeTree.updateRecipeSelection(itemId, recipeIndex);
			calculator.calculateProductionRequirements();
		},
		[recipeTree, calculator],
	);

	// Convert tree structure to ReactFlow nodes and edges
	const { nodes, edges } = useMemo(() =>
	{
		const nodesList: Node<ProductionFlowNodeData>[] = [];
		const edgesList: Edge[] = [];
		let nodeIdCounter = 0;

		const processNode = (treeNode: RecipeTreeNode, parentId: string | null, xOffset: number, yOffset: number): string =>
		{
			const nodeId = `node-${nodeIdCounter++}`;
			const requirement = productionRequirements.get(treeNode.item.id);
			const availableRecipes = allRecipes.get(treeNode.item.id)?.length || 0;

			// Add node
			nodesList.push({
				id: nodeId,
				type: 'productionNode',
				position: { x: xOffset, y: yOffset },
				data: {
					node: treeNode,
					requirement,
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
					label: requirement ? `${requirement.requiredRatePerMinute.toFixed(1)}/min` : '',
					labelStyle: { fontSize: 10, fill: 'hsl(var(--foreground))' },
				});
			}

			// Process children
			if (treeNode.children.length > 0)
			{
				const childSpacing = 350; // Horizontal space between child nodes
				const childYOffset = yOffset + 250; // Vertical space between levels
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

		const treeResult = recipeTree.build();
		processNode(treeResult.root, null, 400, 0);

		return { nodes: nodesList, edges: edgesList };
	}, [recipeTree, productionRequirements, allRecipes, handleRecipeChange]);

	const [nodesState, , onNodesChange] = useNodesState(nodes);
	const [edgesState, , onEdgesChange] = useEdgesState(edges);

	if (productionRequirements.size === 0)
	{
		return (
			<div className="w-full space-y-6">
				<Card>
					<CardHeader>
						<CardTitle>Production Requirements</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-muted-foreground">No data available</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="w-full space-y-6">
			{/* Target Rate Input */}
			<Card>
				<CardHeader>
					<CardTitle>Target Rate</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-2">
						<Label>Units per Minute</Label>
						<Input type="number" value={targetRate} onChange={(e) => setTargetRate(Number(e.target.value))} min="0" step="0.1" className="max-w-xs" />
					</div>
				</CardContent>
			</Card>

			{/* Production Flow Visualization */}
			<Card>
				<CardHeader>
					<CardTitle>Production Requirements</CardTitle>
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
							<MiniMap nodeColor={() => '#3b82f6'} />
						</ReactFlow>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
