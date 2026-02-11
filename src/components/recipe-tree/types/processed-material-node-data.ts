import { Item } from '@/domain/item';
import { Recipe } from '@/domain/recipe';
import { Ingredient } from '@/domain/ingredient';
import { BaseNodeData } from '@/components/recipe-tree';

export interface ProcessedMaterialNodeData extends BaseNodeData
{
	item: Item;
	recipes: Recipe[];
	ingredients: Record<Recipe['id'], Ingredient[]>;
	selectedRecipeId: Recipe['id'] | null;
}
