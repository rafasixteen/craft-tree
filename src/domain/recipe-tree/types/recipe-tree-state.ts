import { Item } from '@/domain/item';
import { Recipe } from '@/domain/recipe';
import { Ingredient } from '@/domain/ingredient';

export interface RecipeTreeNode
{
	id: string;
	item: Item;
	recipes: Recipe[];
	ingredients: Record<Recipe['id'], Ingredient[]>;
	selectedRecipeIndex: number | null;
	parentId: RecipeTreeNode['id'] | null;
	children?: RecipeTreeNode['id'][];
}

export interface RecipeTreeState
{
	rootNodeId: RecipeTreeNode['id'];
	nodes: Record<RecipeTreeNode['id'], RecipeTreeNode>;
}
