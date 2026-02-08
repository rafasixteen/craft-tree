import { Ingredient } from '@/domain/ingredient';
import { Item } from '@/domain/item';
import { Recipe } from '@/domain/recipe';

export interface RecipeTreeNodeData extends Record<string, unknown>
{
	item: Item;
	recipes: Recipe[];
	ingredients: Record<Recipe['id'], Ingredient[]>;
	selectedRecipeIndex: number;
}
