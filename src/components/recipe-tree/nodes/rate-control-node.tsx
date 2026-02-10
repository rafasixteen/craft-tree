import { RecipeTreeNodeData, NodeIcon, ProductionRateControl } from '@/components/recipe-tree';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Handle, Position } from '@xyflow/react';
import { useRecipeTree } from '@/domain/recipe-tree';
import * as NodeHelpers from '@/domain/recipe-tree/utils/recipe-tree-node-helpers';

interface RateControlNodeProps
{
	id: string;
}

export function RateControlNode({ id }: RateControlNodeProps)
{
	const { recipeTree, setRate } = useRecipeTree();

	if (!recipeTree)
	{
		return null;
	}

	return (
		<Card className="max-w-80 min-w-50">
			<CardContent className="space-y-1.5 text-xs text-muted-foreground">
				<ProductionRateControl rate={recipeTree.rate} onChange={setRate} className="nopan" />
			</CardContent>
			<Handle type="source" position={Position.Bottom} />
		</Card>
	);
}
