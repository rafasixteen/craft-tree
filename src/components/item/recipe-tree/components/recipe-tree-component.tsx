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
					<div className="flex items-start gap-8 mt-4 relative">
						{/* Horizontal connector line */}
						{node.children.length > 1 && (
							<div
								className="absolute top-0 left-0 right-0 h-0.5 bg-border transform -translate-y-4"
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
								{node.children.length > 1 && <div className="absolute left-1/2 -top-4 w-0.5 h-4 bg-border -translate-x-1/2" />}
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
					<div className="flex justify-center min-w-max p-8">{renderNode(treeResult.root)}</div>
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
