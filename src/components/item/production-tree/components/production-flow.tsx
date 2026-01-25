'use client';

import { useState, useMemo } from 'react';
import { Item } from '@/domain/item';
import { Recipe } from '@/domain/recipe';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Ingredient } from '@/domain/ingredient';
import { RecipeTreeNode, RecipeTree } from '@/components/item/recipe-tree';
import { ProductionCalculator } from '@/components/item/production-tree';

interface ProductionFlowProps
{
	item: Item;
	allRecipes: Map<string, Recipe[]>;
	allIngredients: Map<string, Ingredient[]>;
	allItems: Map<string, Item>;
}

export function ProductionFlow({ item, allRecipes, allIngredients, allItems }: ProductionFlowProps)
{
	const [targetRate, setTargetRate] = useState(20); // units per minute

	const [recipeTree, calculator, productionRequirements] = useMemo(() =>
	{
		const tree = new RecipeTree(item, 1, allRecipes, allIngredients, allItems);
		const calc = new ProductionCalculator(tree, targetRate, allRecipes, allIngredients, allItems);
		const reqs = calc.calculateProductionRequirements();
		return [tree, calc, reqs];
	}, [item, targetRate, allRecipes, allIngredients, allItems]);

	const handleRecipeChange = (itemId: string, recipeIndex: number) =>
	{
		recipeTree.updateRecipeSelection(itemId, recipeIndex);
		calculator.calculateProductionRequirements();
	};

	const renderProductionNode = (node: RecipeTreeNode): React.ReactNode =>
	{
		const requirement = productionRequirements.get(node.item.id);
		const availableRecipes = allRecipes.get(node.item.id)?.length || 0;

		return (
			<div key={`${node.item.id}-${node.depth}`} className="flex flex-col items-center">
				{/* Node Card */}
				<Card className="relative min-w-[200px]">
					<CardContent className="pt-4 space-y-3">
						{/* Item and Recipe Name */}
						<div className="flex items-center gap-2">
							<div className="w-8 h-8 bg-muted rounded border flex items-center justify-center text-xs font-mono">{node.item.name.substring(0, 2).toUpperCase()}</div>
							<div className="flex-1 min-w-0">
								<p className="font-semibold text-sm">{node.item.name}</p>
								{node.recipe && <p className="text-xs text-muted-foreground truncate">{node.recipe.name}</p>}
							</div>
						</div>

						{/* Production Requirements */}
						{requirement && (
							<div className="space-y-2 border-t pt-3">
								{/* Manufacturer Count */}
								{requirement.recipeId && (
									<div>
										<p className="text-xs text-muted-foreground">Manufacturers Needed</p>
										<p className="text-lg font-bold">{Math.ceil(requirement.manufacturersNeeded)}</p>
										<p className="text-xs text-muted-foreground">
											{requirement.manufacturersNeeded.toFixed(2)} @ {requirement.utilizationPercent.toFixed(1)}%
										</p>
									</div>
								)}

								{/* Production Rate */}
								<div className="grid grid-cols-2 gap-2">
									<div>
										<p className="text-xs text-muted-foreground">Per Min</p>
										<p className="font-mono font-semibold text-sm">{requirement.requiredRatePerMinute.toFixed(1)}</p>
									</div>
									<div>
										<p className="text-xs text-muted-foreground">Per Sec</p>
										<p className="font-mono font-semibold text-sm">{(requirement.requiredRatePerMinute / 60).toFixed(3)}</p>
									</div>
								</div>

								{/* Cycle Info */}
								{requirement.recipeId && (
									<div className="text-xs text-muted-foreground">
										<p>
											{requirement.producedPerCycle}/cycle @ {requirement.cycleTimeSeconds}s
										</p>
									</div>
								)}
							</div>
						)}

						{/* Recipe Carousel */}
						{availableRecipes > 1 && (
							<div className="border-t pt-2 flex justify-between items-center">
								<button
									onClick={() => handleRecipeChange(node.item.id, node.selectedRecipeIndex === 0 ? availableRecipes - 1 : (node.selectedRecipeIndex || 0) - 1)}
									className="p-1 hover:bg-muted rounded"
								>
									{'<'}
								</button>
								<span className="text-xs text-muted-foreground">
									{(node.selectedRecipeIndex || 0) + 1} / {availableRecipes}
								</span>
								<button
									onClick={() => handleRecipeChange(node.item.id, node.selectedRecipeIndex === availableRecipes - 1 ? 0 : (node.selectedRecipeIndex || 0) + 1)}
									className="p-1 hover:bg-muted rounded"
								>
									{'>'}
								</button>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Render children in a grid */}
				{node.children.length > 0 && (
					<div className="flex items-start gap-8 mt-4">
						{node.children.map((child, idx) => (
							<div key={`${child.item.id}-${idx}`}>{renderProductionNode(child)}</div>
						))}
					</div>
				)}
			</div>
		);
	};

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
			{/* Production Flow Visualization */}
			<Card>
				<CardHeader>
					<CardTitle>Production Requirements</CardTitle>
				</CardHeader>
				<CardContent className="overflow-x-auto">
					<div className="flex justify-center min-w-max p-8">{renderProductionNode(recipeTree.build().root)}</div>
				</CardContent>
			</Card>

			{/* Target Rate Input */}
			<Card>
				<CardHeader>
					<CardTitle>Target Rate</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-2">
						<Label>Units per Minute</Label>
						<Input type="number" value={targetRate} onChange={(e) => setTargetRate(Number(e.target.value))} min="0" step="0.1" />
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
