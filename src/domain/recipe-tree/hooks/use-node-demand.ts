import { ProductionRate, RecipeTreeNode, useRecipeTree } from '@/domain/recipe-tree';
import * as NodeHelpers from '@/domain/recipe-tree/utils/recipe-tree-node-helpers';
import { useMemo } from 'react';

export function useNodeDemand(nodeId: RecipeTreeNode['id']): ProductionRate
{
	const { recipeTree } = useRecipeTree();

	const demand = useMemo(() =>
	{
		if (!recipeTree)
		{
			return { amount: 0, per: 'second' } as ProductionRate;
		}

		return NodeHelpers.getNodeDemand(recipeTree, nodeId);
	}, [recipeTree, nodeId]);

	return demand;
}
