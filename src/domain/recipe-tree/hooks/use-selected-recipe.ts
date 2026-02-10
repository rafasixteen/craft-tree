import { RecipeTreeNode, useRecipeTree } from '@/domain/recipe-tree';
import * as NodeHelpers from '@/domain/recipe-tree/utils/recipe-tree-node-helpers';

export function useSelectedRecipe(nodeId: RecipeTreeNode['id'])
{
	const { recipeTree } = useRecipeTree();

	if (!recipeTree)
	{
		return null;
	}

	const node = NodeHelpers.ensureNode(recipeTree, nodeId);
	return NodeHelpers.findSelectedRecipe(node);
}
