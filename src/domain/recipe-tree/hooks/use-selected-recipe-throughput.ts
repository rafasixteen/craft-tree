import { ProductionRate, RecipeTreeNode, useRecipeTree } from '@/domain/recipe-tree';
import { useMemo } from 'react';
import * as NodeHelpers from '@/domain/recipe-tree/utils/recipe-tree-node-helpers';

export function useSelectedRecipeThroughput(nodeId: RecipeTreeNode['id']): ProductionRate
{
	const { recipeTree } = useRecipeTree();

	if (!recipeTree)
	{
		throw new Error('recipeTree is required to calculate node stats');
	}

	const throughput = useMemo(() =>
	{
		const node = NodeHelpers.ensureNode(recipeTree, nodeId);
		const recipe = NodeHelpers.findSelectedRecipe(node);

		if (!recipe)
		{
			return { amount: 0, per: 'second' } as ProductionRate;
		}

		return NodeHelpers.getRecipeThroughput(recipe);
	}, [recipeTree, nodeId]);

	return throughput;
}
