import { RecipeTreeNode, useRecipeTree } from '@/domain/recipe-tree';
import * as NodeHelpers from '@/domain/recipe-tree/utils/recipe-tree-node-helpers';
import { useMemo } from 'react';

export function useProducerCount(nodeId: RecipeTreeNode['id']): number
{
	const { recipeTree } = useRecipeTree();

	const producerCount = useMemo(() =>
	{
		if (!recipeTree)
		{
			return 0;
		}

		const node = NodeHelpers.ensureNode(recipeTree, nodeId);
		const recipe = NodeHelpers.findSelectedRecipe(node);

		if (!recipe)
		{
			return 0;
		}

		return NodeHelpers.getRequiredProducers(recipeTree, nodeId);
	}, [recipeTree, nodeId]);

	return producerCount;
}
