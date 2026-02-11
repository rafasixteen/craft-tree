import { Ingredient, Item, Recipe } from '@/domain';

export type NodeType = 'rate-control' | 'processed-material' | 'raw-material';

export interface RawMaterialNodeData extends Record<string, unknown>
{
	item: Item;
}

export interface ProcessedMaterialNodeData extends Record<string, unknown>
{
	item: Item;
	recipes: Recipe[];
	ingredients: Record<Recipe['id'], Ingredient[]>;
	selectedRecipeId: Recipe['id'] | null;
}
