import { RecipeTreeNode, RecipeTreeState } from '@/domain/recipe-tree';
import { Recipe } from '@/domain/recipe/types';

// TODO: Calculate the Bill Of Materials (BOM) for a given node,
// which is the flattened list of all ingredients required to produce
// the node's item, taking into account the selected recipes at each level of the tree.

/**
 * Ensures that a node with the given ID exists in the tree state and returns it.
 * Throws an error if the node is not found.
 * @param state The current state of the recipe tree.
 * @param nodeId The ID of the node to ensure exists.
 * @returns The node with the specified ID.
 */
export function ensureNode(state: RecipeTreeState, nodeId: RecipeTreeNode['id']): RecipeTreeNode
{
	const node = state.nodes[nodeId];

	if (!node)
	{
		throw new Error(`Node with id "${nodeId}" not found in the tree.`);
	}

	return node;
}

/**
 * Returns the index of the node's currently selected recipe within its recipes array.
 * This is derived from `node.selectedRecipeId`.
 *
 * @param node The node to find the selected recipe index for.
 * @returns The index of the selected recipe, or -1 if no recipe is selected.
 */
export function findSelectedRecipeIndex(node: RecipeTreeNode): number
{
	return node.recipes.findIndex((recipe) => recipe.id === node.selectedRecipeId);
}

/**
 * Returns the currently selected recipe for the given node.
 *
 * Throws an error if `node.selectedRecipeId` is set but no matching recipe is found.
 *
 * @param node The node to find the selected recipe for.
 * @returns The selected recipe object, or `null` if no recipe is selected.
 *
 * @throws Will throw an error if `node.selectedRecipeId` is set but no corresponding recipe exists.
 */
export function findSelectedRecipe(node: RecipeTreeNode): Recipe | null
{
	if (!node.selectedRecipeId)
	{
		return null;
	}

	const recipe = node.recipes.find((r) => r.id === node.selectedRecipeId);

	if (!recipe)
	{
		throw new Error(`Selected recipe with id "${node.selectedRecipeId}" not found in node with item "${node.item.name}".`);
	}

	return recipe;
}

/**
 * Computes the *resolved quantity* for a given node in the recipe tree.
 *
 * The resolved quantity is the total number of items required for this node,
 * taking into account:
 *   1. The quantities of its parent nodes recursively.
 *   2. The selected recipe at each parent node.
 *
 * If a node has no parent (root), this simply returns the quantity of its
 * selected recipe. Otherwise, it multiplies the quantity required by the parent
 * for this node’s ingredient.
 *
 * @param state The current state of the recipe tree.
 * @param nodeId The ID of the node to compute the resolved quantity for.
 *
 * @throws Will throw an error if:
 *   - The node or its parent cannot be found in the state.
 *   - A parent node has no selected recipe.
 *   - The node itself has no selected recipe.
 *
 * @returns The total resolved quantity required for this node.
 */
export function getResolvedQuantity(state: RecipeTreeState, nodeId: RecipeTreeNode['id']): number
{
	const node = ensureNode(state, nodeId);

	if (node.parentId)
	{
		const parentNode = ensureNode(state, node.parentId);
		const parentSelectedRecipe = findSelectedRecipe(parentNode);

		if (!parentSelectedRecipe)
		{
			throw new Error(`Parent node with item "${parentNode.item.name}" has no selected recipe.`);
		}

		const parentSelectedRecipeIngredients = parentNode.ingredients[parentSelectedRecipe.id];
		const ingredient = parentSelectedRecipeIngredients?.find((ing) => ing.itemId === node.item.id);

		if (!ingredient)
		{
			return 0;
		}

		return getResolvedQuantity(state, parentNode.id) * ingredient.quantity;
	}
	else
	{
		const selectedRecipe = findSelectedRecipe(node);

		if (!selectedRecipe)
		{
			throw new Error(`Node with item "${node.item.name}" has no selected recipe.`);
		}

		return selectedRecipe.quantity;
	}
}

/**
 * Computes the total resolved time required for the given node in the recipe tree.
 *
 * The resolved time is the sum of:
 *   1. The time required to produce the node itself (via `getNodeTime`), and
 *   2. The resolved time of its children recursively, according to the selected recipe.
 *
 * If the node has no selected recipe, only the node's base time is considered.
 *
 * @param state The current state of the recipe tree.
 * @param nodeId The ID of the node to compute the resolved time for.
 *
 * @returns The total time required to produce the node and its selected children.
 *
 * @throws Will throw an error if the node cannot be found in the state.
 */
export function getResolvedTime(state: RecipeTreeState, nodeId: RecipeTreeNode['id']): number
{
	const node = ensureNode(state, nodeId);

	let totalTime = getNodeTime(state, nodeId);

	if (node.selectedRecipeId)
	{
		for (const child of node.children[node.selectedRecipeId])
		{
			const childTime = getResolvedTime(state, child);
			totalTime += childTime;
		}
	}

	return totalTime;
}

/**
 * Computes the base time required to produce a single node, ignoring its children.
 *
 * The node time is calculated as:
 *   nodeTotalQuantity * recipe.time
 * where `nodeTotalQuantity` is obtained via `getResolvedQuantity`.
 *
 * If the node has no selected recipe, the time is considered 0.
 *
 * @param state The current state of the recipe tree.
 * @param nodeId The ID of the node to compute the time for.
 *
 * @returns The time required to produce the node itself, ignoring children.
 *
 * @throws Will throw an error if the node cannot be found in the state.
 */
export function getNodeTime(state: RecipeTreeState, nodeId: RecipeTreeNode['id']): number
{
	const node = ensureNode(state, nodeId);
	const selectedRecipe = findSelectedRecipe(node);

	if (selectedRecipe)
	{
		return getResolvedQuantity(state, nodeId) * selectedRecipe.time;
	}
	else
	{
		return 0;
	}
}
