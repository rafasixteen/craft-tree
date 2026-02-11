import { BillOfMaterials, calculateBillOfMaterials, useRecipeTree } from '@/domain/recipe-tree';

export function useBillOfMaterials(): BillOfMaterials
{
	const { recipeTree } = useRecipeTree();

	if (!recipeTree)
	{
		return [];
	}

	return calculateBillOfMaterials(recipeTree);
}
