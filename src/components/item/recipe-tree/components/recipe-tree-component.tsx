'use client';

import { useState } from 'react';
import { Item } from '@/domain/item';
import { Ingredient } from '@/domain/ingredient';
import { Recipe } from '@/domain/recipe';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RecipeTree, RecipeTreeResult, RecipeTreeNode } from '../utils/recipe-tree';
import { RecipeTreeNodeComponent } from './recipe-tree-node-component';

interface RecipeTreeProps
{
	item: Item;
	quantity?: number;
	// Map of itemId -> all recipes for that item
	allRecipes: Map<string, Recipe[]>;
	// Map of recipeId -> ingredients for that recipe
	allIngredients: Map<string, Ingredient[]>;
	// Map of itemId -> item details
	allItems: Map<string, Item>;
}

export function RecipeTreeComponent({ item, quantity = 1, allRecipes, allIngredients, allItems }: RecipeTreeProps)
{
	const [treeInstance] = useState(() => new RecipeTree(item, quantity, allRecipes, allIngredients, allItems));
	const [treeResult, setTreeResult] = useState<RecipeTreeResult>(treeInstance.build());

	const handleRecipeChange = (itemId: string, recipeIndex: number) =>
	{
		const newResult = treeInstance.updateRecipeSelection(itemId, recipeIndex);
		setTreeResult(newResult);
	};

	const renderNode = (node: RecipeTreeNode): React.ReactNode =>
	{
		const availableRecipes = treeInstance.getRecipesForItem(node.item.id).length;

		return (
			<div key={`${node.item.id}-${node.depth}`} className="flex flex-col items-center">
				<RecipeTreeNodeComponent node={node} availableRecipes={availableRecipes} onRecipeChange={handleRecipeChange} />

				{/* Render children */}
				{node.children.length > 0 && (
					<div className="relative mt-4 flex items-start gap-8">
						{/* Horizontal connector line */}
						{node.children.length > 1 && (
							<div
								className="absolute inset-x-0 top-0 h-0.5 -translate-y-4 transform bg-border"
								style={{
									left: '50%',
									transform: 'translateX(-50%) translateY(-1rem)',
									width: `calc(100% - ${100 / node.children.length}%)`,
								}}
							/>
						)}

						{node.children.map((child: any, idx: any) => (
							<div key={`${child.item.id}-${idx}`} className="relative">
								{/* Vertical connector to horizontal line */}
								{node.children.length > 1 && <div className="absolute -top-4 left-1/2 h-4 w-0.5 -translate-x-1/2 bg-border" />}
								{renderNode(child)}
							</div>
						))}
					</div>
				)}
			</div>
		);
	};

	const totalCostItems = Array.from(treeResult.totalCost.values()).sort((a: any, b: any) => a.item.name.localeCompare(b.item.name));

	const leftoverItems = Array.from(treeResult.leftovers.values()).sort((a: any, b: any) => a.item.name.localeCompare(b.item.name));

	return (
		<div className="w-full space-y-6">
			{/* Recipe Tree Visualization */}
			<Card>
				<CardHeader>
					<CardTitle>Crafting Tree</CardTitle>
				</CardHeader>
				<CardContent className="overflow-x-auto">
					<div className="flex min-w-max justify-center p-8">{renderNode(treeResult.root)}</div>
				</CardContent>
			</Card>

			{/* Total Cost and Leftovers */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
									<div key={costItem.id} className="flex items-center gap-2 rounded-sm bg-muted/50 p-2">
										<div className="flex size-6 items-center justify-center rounded-sm border bg-background font-mono text-xs">
											{costItem.name.substring(0, 1).toUpperCase()}
										</div>
										<span className="flex-1 text-sm">{costItem.name}</span>
										<span className="rounded-sm bg-primary/10 px-2 py-1 font-mono text-xs font-bold text-primary">{qty}</span>
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
									<div key={leftoverItem.id} className="flex items-center gap-2 rounded-sm bg-yellow-50 p-2 dark:bg-yellow-950">
										<div className="flex size-6 items-center justify-center rounded-sm border bg-background font-mono text-xs">
											{leftoverItem.name.substring(0, 1).toUpperCase()}
										</div>
										<span className="flex-1 text-sm">{leftoverItem.name}</span>
										<span className="rounded-sm bg-yellow-200 px-2 py-1 font-mono text-xs font-bold dark:bg-yellow-800">{qty}</span>
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
