'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Card, CardContent } from '@/components/ui/card';
import { RecipeTreeNode } from '../utils/recipe-tree';

export interface RecipeFlowNodeData extends Record<string, unknown>
{
	node: RecipeTreeNode;
	availableRecipes: number;
	onRecipeChange: (itemId: string, recipeIndex: number) => void;
}

export const RecipeFlowNode = memo((props: NodeProps) =>
{
	const { node, availableRecipes, onRecipeChange } = props.data as RecipeFlowNodeData;

	return (
		<>
			{/* Top handle for inputs */}
			<Handle type="target" position={Position.Top} className="bg-primary!" />

			<Card className="min-w-50 shadow-md border-2">
				<CardContent className="pt-4 space-y-3">
					{/* Item and Recipe Name */}
					<div className="flex items-center gap-2">
						<div className="w-8 h-8 bg-muted rounded border flex items-center justify-center text-xs font-mono">{node.item.name.substring(0, 2).toUpperCase()}</div>
						<div className="flex-1 min-w-0">
							<p className="font-semibold text-sm">{node.item.name}</p>
							{node.recipe && <p className="text-xs text-muted-foreground truncate">{node.recipe.name}</p>}
						</div>
					</div>

					{/* Recipe Details */}
					{node.recipe && (
						<div className="space-y-2 border-t pt-2">
							<div>
								<p className="text-xs text-muted-foreground">Quantity Needed</p>
								<p className="text-sm font-bold">{node.quantity}</p>
							</div>
							<div>
								<p className="text-xs text-muted-foreground">Produced per Craft</p>
								<p className="text-sm font-mono">{node.recipe.quantity}</p>
							</div>
							{node.recipe.time !== null && (
								<div>
									<p className="text-xs text-muted-foreground">Craft Time</p>
									<p className="text-sm font-mono">{node.recipe.time}s</p>
								</div>
							)}
							<div>
								<p className="text-xs text-muted-foreground">Crafts Needed</p>
								<p className="text-sm font-bold">{Math.ceil(node.quantity / node.recipe.quantity)}</p>
							</div>
						</div>
					)}

					{/* Recipe Carousel */}
					{availableRecipes > 1 && (
						<div className="border-t pt-2 flex justify-between items-center">
							<button
								onClick={() => onRecipeChange(node.item.id, node.selectedRecipeIndex === 0 ? availableRecipes - 1 : (node.selectedRecipeIndex || 0) - 1)}
								className="p-1 hover:bg-muted rounded transition-colors"
								aria-label="Previous recipe"
							>
								←
							</button>
							<span className="text-xs text-muted-foreground">
								{(node.selectedRecipeIndex || 0) + 1} / {availableRecipes}
							</span>
							<button
								onClick={() => onRecipeChange(node.item.id, node.selectedRecipeIndex === availableRecipes - 1 ? 0 : (node.selectedRecipeIndex || 0) + 1)}
								className="p-1 hover:bg-muted rounded transition-colors"
								aria-label="Next recipe"
							>
								→
							</button>
						</div>
					)}

					{/* Base item indicator */}
					{!node.recipe && (
						<div className="border-t pt-2">
							<p className="text-xs text-muted-foreground italic">Base ingredient</p>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Bottom handle for outputs */}
			<Handle type="source" position={Position.Bottom} className="bg-primary!" />
		</>
	);
});

RecipeFlowNode.displayName = 'RecipeFlowNode';
