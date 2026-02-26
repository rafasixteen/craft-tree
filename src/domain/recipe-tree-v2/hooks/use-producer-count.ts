import { useRecipeTree, getRequiredProducers } from '@/domain/recipe-tree-v2';
import { useMemo } from 'react';

export function useProducerCount(nodeId: string)
{
	const { recipeTree } = useRecipeTree();

	return useMemo(() =>
	{
		if (!recipeTree)
		{
			return 0;
		}

		return getRequiredProducers(recipeTree, nodeId);
	}, [recipeTree, nodeId]);
}
