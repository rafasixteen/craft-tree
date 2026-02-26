import { ProductionRate } from '@/domain/production-graph';
import { useRecipeTree, getNodeDemand } from '@/domain/recipe-tree';
import { useMemo } from 'react';

export function useNodeDemand(nodeId: string): ProductionRate
{
	const { recipeTree } = useRecipeTree();

	return useMemo(() =>
	{
		if (!recipeTree)
		{
			return { amount: 0, per: 'second' };
		}

		return getNodeDemand(recipeTree, nodeId);
	}, [recipeTree, nodeId]);
}
