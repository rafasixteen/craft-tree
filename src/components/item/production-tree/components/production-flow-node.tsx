'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Card, CardContent } from '@/components/ui/card';
import { RecipeTreeNode } from '@/components/item/recipe-tree';

export interface ProductionRequirement
{
	itemId: string;
	recipeId: string | null;
	requiredRatePerMinute: number;
	manufacturersNeeded: number;
	utilizationPercent: number;
	cycleTimeSeconds: number;
	producedPerCycle: number;
}

export interface ProductionFlowNodeData extends Record<string, unknown>
{
	node: RecipeTreeNode;
	requirement: ProductionRequirement | undefined;
	availableRecipes: number;
	onRecipeChange: (itemId: string, recipeIndex: number) => void;
}

export const ProductionFlowNode = memo((props: NodeProps) =>
{
	const { node, requirement, availableRecipes, onRecipeChange } = props.data as ProductionFlowNodeData;

	return (
		<>
			{/* Top handle for inputs */}
			<Handle type="target" position={Position.Top} className="bg-blue-500!" />

			<Card className="min-w-55 border-2 shadow-md">
				<CardContent className="space-y-3 pt-4">
					{/* Item and Recipe Name */}
					<div className="flex items-center gap-2">
						<div className="flex size-8 items-center justify-center rounded-sm border bg-muted font-mono text-xs">{node.item.name.substring(0, 2).toUpperCase()}</div>
						<div className="min-w-0 flex-1">
							<p className="text-sm font-semibold">{node.item.name}</p>
							{node.recipe && <p className="truncate text-xs text-muted-foreground">{node.recipe.name}</p>}
						</div>
					</div>

					{/* Production Requirements */}
					{requirement && (
						<div className="space-y-2 border-t pt-3">
							{/* Manufacturer Count */}
							{requirement.recipeId && (
								<div className="rounded-sm bg-blue-50 p-2 dark:bg-blue-950/30">
									<p className="text-xs text-muted-foreground">Manufacturers Needed</p>
									<p className="text-lg font-bold text-blue-600 dark:text-blue-400">{Math.ceil(requirement.manufacturersNeeded)}</p>
									<p className="text-xs text-muted-foreground">
										{requirement.manufacturersNeeded.toFixed(2)} @ {requirement.utilizationPercent.toFixed(1)}%
									</p>
								</div>
							)}

							{/* Production Rate */}
							<div className="grid grid-cols-2 gap-2">
								<div className="rounded-sm bg-muted/50 p-2">
									<p className="text-xs text-muted-foreground">Per Min</p>
									<p className="font-mono text-sm font-semibold">{requirement.requiredRatePerMinute.toFixed(1)}</p>
								</div>
								<div className="rounded-sm bg-muted/50 p-2">
									<p className="text-xs text-muted-foreground">Per Sec</p>
									<p className="font-mono text-sm font-semibold">{(requirement.requiredRatePerMinute / 60).toFixed(3)}</p>
								</div>
							</div>

							{/* Cycle Info */}
							{requirement.recipeId && (
								<div className="rounded-sm bg-muted/30 p-2 text-xs text-muted-foreground">
									<p>
										{requirement.producedPerCycle}/cycle @ {requirement.cycleTimeSeconds}s
									</p>
								</div>
							)}
						</div>
					)}

					{/* Recipe Carousel */}
					{availableRecipes > 1 && (
						<div className="flex items-center justify-between border-t pt-2">
							<button
								onClick={() => onRecipeChange(node.item.id, node.selectedRecipeIndex === 0 ? availableRecipes - 1 : (node.selectedRecipeIndex || 0) - 1)}
								className="rounded-sm p-1 transition-colors hover:bg-muted"
								aria-label="Previous recipe"
							>
								←
							</button>
							<span className="text-xs text-muted-foreground">
								{(node.selectedRecipeIndex || 0) + 1} / {availableRecipes}
							</span>
							<button
								onClick={() => onRecipeChange(node.item.id, node.selectedRecipeIndex === availableRecipes - 1 ? 0 : (node.selectedRecipeIndex || 0) + 1)}
								className="rounded-sm p-1 transition-colors hover:bg-muted"
								aria-label="Next recipe"
							>
								→
							</button>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Bottom handle for outputs */}
			<Handle type="source" position={Position.Bottom} className="bg-blue-500!" />
		</>
	);
});

ProductionFlowNode.displayName = 'ProductionFlowNode';
