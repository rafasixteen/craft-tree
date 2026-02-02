import { Ingredient } from '@/domain/ingredient';
import { Item } from '@/domain/item';
import { Recipe } from '@/domain/recipe';

/**
 * Represents a node in the recipe tree.
 */
export interface RecipeTreeNodeData extends Record<string, unknown>
{
	/**
	 * The item represented by this node.
	 */
	item: Item;

	/**
	 * Recipes that produce this item.
	 */
	recipes: Recipe[];

	/**
	 * A mapping of each recipe to its corresponding ingredients.
	 */
	ingredientsMap: Map<Recipe, Ingredient[]>;

	/**
	 * The index of the currently selected recipe in the {@link recipes} array.
	 */
	selectedRecipeIndex: number;

	/**
	 * Indicates whether this node is the root of the recipe tree.
	 */
	isRoot: boolean;
}
