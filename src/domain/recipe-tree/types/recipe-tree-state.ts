import { Item } from '@/domain/item';
import { Recipe } from '@/domain/recipe';
import { Ingredient } from '@/domain/ingredient';
import { ProductionRate } from '@/domain/recipe-tree';

export interface RecipeTreeNode
{
	/**
	 * Unique identifier for the node in the tree. This is not the same as the item id, as the same item can appear multiple times in the tree with different recipes.
	 */
	id: string;

	/**
	 * The item associated with this node.
	 */
	item: Item;

	/**
	 * The recipes that can be used to craft the item. This can be empty if the item is a raw material.
	 */
	recipes: Recipe[];

	/**
	 * A mapping of recipe id to the list of ingredients for that recipe.
	 */
	ingredients: Record<Recipe['id'], Ingredient[]>;

	/**
	 * The id of the selected recipe for this node. This is null if no recipe is selected.
	 */
	selectedRecipeId: Recipe['id'] | null;

	/**
	 * The id of the parent node in the tree. This is null for the root node.
	 */
	parentId: RecipeTreeNode['id'] | null;

	/**
	 * A mapping of recipe id to the child node ids for that recipe. This is used to quickly find the child nodes for a given recipe.
	 */
	children: Record<Recipe['id'], RecipeTreeNode['id'][]>;
}

export interface RecipeTreeState
{
	/**
	 * Target production rate for the root item.
	 */
	rate: ProductionRate;

	/**
	 * The id of the root node in the tree.
	 */
	rootNodeId: RecipeTreeNode['id'];

	/**
	 * A mapping of node id to the node data. This is used to quickly find a node by its id.
	 */
	nodes: Record<RecipeTreeNode['id'], RecipeTreeNode>;
}
