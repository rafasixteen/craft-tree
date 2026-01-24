'use client';

import { useState, useMemo } from 'react';
import { Item } from '@/domain/item';
import { Recipe } from '@/domain/recipe';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Ingredient } from '@/domain/ingredient';
import { RecipeTreeNode, RecipeTree } from '@/components/recipe';
import { ProductionCalculator } from '@/components/recipe';

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
									←
								</button>
								<span className="text-xs text-muted-foreground">
									Recipe {(node.selectedRecipeIndex || 0) + 1}/{availableRecipes}
								</span>
								<button
									onClick={() => handleRecipeChange(node.item.id, node.selectedRecipeIndex === availableRecipes - 1 ? 0 : (node.selectedRecipeIndex || 0) + 1)}
									className="p-1 hover:bg-muted rounded"
								>
									→
								</button>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Vertical connector */}
				{node.children.length > 0 && <div className="w-0.5 h-4 bg-border" />}

				{/* Child nodes */}
				{node.children.length > 0 && (
					<div className="flex items-start gap-8 mt-4 relative">
						{node.children.length > 1 && (
							<div
								className="absolute top-0 left-0 right-0 h-0.5 bg-border"
								style={{
									left: '50%',
									transform: 'translateX(-50%) translateY(-1rem)',
									width: `calc(100% - ${100 / node.children.length}%)`,
								}}
							/>
						)}

						{node.children.map((child, idx) => (
							<div key={`${child.item.id}-${idx}`} className="relative">
								{node.children.length > 1 && <div className="absolute left-1/2 -top-4 w-0.5 h-4 bg-border -translate-x-1/2" />}
								{renderProductionNode(child)}
							</div>
						))}
					</div>
				)}
			</div>
		);
	};

	const treeResult = recipeTree.build();

	return (
		<div className="w-full space-y-6">
			{/* Target Rate Input */}
			<Card>
				<CardHeader>
					<CardTitle>Production Target</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="target-rate">
							Target production rate for <strong>{item.name}</strong>
						</Label>
						<div className="flex items-center gap-2">
							<Input
								id="target-rate"
								type="number"
								min="0"
								step="1"
								value={targetRate}
								onChange={(e) => setTargetRate(Math.max(0, parseInt(e.target.value) || 0))}
								className="max-w-xs"
							/>
							<span className="text-sm text-muted-foreground">units per minute</span>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Production Tree */}
			<Card>
				<CardHeader>
					<CardTitle>Production Chain</CardTitle>
				</CardHeader>
				<CardContent className="overflow-x-auto">
					<div className="flex justify-center min-w-max p-8">{renderProductionNode(treeResult.root)}</div>
				</CardContent>
			</Card>

			{/* Requirements Summary */}
			<Card>
				<CardHeader>
					<CardTitle>Summary</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{Array.from(productionRequirements.values()).map((req) => (
							<div key={req.itemId} className="flex items-center justify-between p-2 rounded bg-muted/50">
								<div>
									<p className="font-semibold text-sm">{req.itemName}</p>
									{req.recipeName && <p className="text-xs text-muted-foreground">{req.recipeName}</p>}
								</div>
								<div className="text-right">
									{req.recipeId ? (
										<>
											<p className="font-mono font-bold">{Math.ceil(req.manufacturersNeeded)} manufact.</p>
											<p className="text-xs text-muted-foreground">{req.utilizationPercent.toFixed(0)}% utilized</p>
										</>
									) : (
										<p className="font-mono font-bold">{req.requiredRatePerMinute.toFixed(1)}/min</p>
									)}
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
