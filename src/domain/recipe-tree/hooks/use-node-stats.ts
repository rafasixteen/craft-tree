import { RecipeTreeNode, useRecipeTree } from '@/domain/recipe-tree';
import * as NodeHelpers from '@/domain/recipe-tree/utils/recipe-tree-node-helpers';

interface NodeProductionStats
{
	demand: ReturnType<typeof NodeHelpers.getNodeDemand>;
	producerCount?: number;
	recipeThroughput?: ReturnType<typeof NodeHelpers.getRecipeThroughput>;
}

export function useNodeStats(nodeId: RecipeTreeNode['id']): NodeProductionStats
{
	const { recipeTree } = useRecipeTree();

	if (!recipeTree)
	{
		throw new Error('recipeTree is required to calculate node stats');
	}

	const node = NodeHelpers.ensureNode(recipeTree, nodeId);
	const recipe = NodeHelpers.findSelectedRecipe(node);

	if (!recipe)
	{
		return { demand: NodeHelpers.getNodeDemand(recipeTree, nodeId) };
	}
	else
	{
		return {
			demand: NodeHelpers.getNodeDemand(recipeTree, nodeId),
			producerCount: NodeHelpers.getRequiredProducers(recipeTree, nodeId),
			recipeThroughput: NodeHelpers.getRecipeThroughput(recipe),
		};
	}
}
