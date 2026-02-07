import { Ingredient } from '@/domain/ingredient';
import { Item } from '@/domain/item';
import { Recipe } from '@/domain/recipe';

export interface RecipeTreeData
{
	/**
	 * All items that are used in the recipe tree.
	 */
	items: Item[];

	/**
	 * All recipes required to craft all items in the recipe tree.
	 */
	recipes: Recipe[];

	/**
	 * All ingredients used in any of the recipes.
	 */
	ingredients: Ingredient[];
}
