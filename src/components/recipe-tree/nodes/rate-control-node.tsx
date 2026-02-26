import { Handle, Position } from '@xyflow/react';
import { useRecipeTree } from '@/domain/recipe-tree';
import { ProductionRateComponent } from '@/components/production-graph';
import { BaseNode, BaseNodeContent, BaseNodeHeader } from '@/components/base-node';

// TODO: add preference buttons (“fastest”, “cheapest”, etc.)
// that will automatically pick recipes in the recipe tree,
// optimizing according to a criterion.

export function RateControlNode()
{
	const { recipeTree, setRate } = useRecipeTree();

	const rate = recipeTree?.rate ?? { amount: 0, per: 'second' };

	return (
		<BaseNode className="w-65">
			<BaseNodeHeader className="flex items-center gap-2 border-b p-3">
				<div className="min-w-0">
					<p className="text-sm font-semibold">Rate Control</p>
				</div>
			</BaseNodeHeader>
			<BaseNodeContent className="p-3">
				<ProductionRateComponent value={rate} onChange={setRate} className="nodrag nopan" />
			</BaseNodeContent>
			<Handle type="source" position={Position.Bottom} />
		</BaseNode>
	);
}
