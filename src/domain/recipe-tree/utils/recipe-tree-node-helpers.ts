import { ProductionRate, RecipeTreeNode, RecipeTreeState, TimeUnit, convertProductionRate, BillOfMaterials, BillOfMaterialsEntry } from '@/domain/recipe-tree';
import { Item } from '@/domain/item';
import { dfs } from '@/domain/recipe-tree';
import { Recipe } from '@/domain/recipe';

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

	if (!node.parentId)
	{
		const selectedRecipe = findSelectedRecipe(node);

		if (!selectedRecipe)
		{
			throw new Error(`Node with item "${node.item.name}" has no selected recipe.`);
		}

		return selectedRecipe.quantity;
	}

	const parent = ensureNode(state, node.parentId);
	const parentRecipe = findSelectedRecipe(parent);

	if (!parentRecipe)
	{
		throw new Error(`Parent node with item "${parent.item.name}" has no selected recipe.`);
	}

	const ingredients = parent.ingredients[parentRecipe.id];
	const ingredient = ingredients?.find((ing) => ing.itemId === node.item.id);

	if (!ingredient)
	{
		return 0;
	}

	return getResolvedQuantity(state, parent.id) * ingredient.quantity;
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

/**
 * Calculates the production capacity of a single producer executing a recipe.
 *
 * This represents how many units of the recipe’s output are produced per
 * time unit, assuming the producer is running continuously.
 *
 * @param recipe The recipe to compute throughput for.
 * @param unit The time unit to express the throughput in (default is 'second').
 *             For example, 'minute' or 'hour'.
 *
 * @returns The production rate of one producer running this recipe in the
 *          specified time unit.
 *
 * @example
 * // Recipe produces 10 items in 5 seconds
 * const recipe = { quantity: 10, time: 5 };
 * getRecipeThroughput(recipe, 'second'); // { amount: 2, per: 'second' }
 * getRecipeThroughput(recipe, 'minute'); // { amount: 120, per: 'minute' }
 */
export function getRecipeThroughput(recipe: Recipe, unit: TimeUnit = 'second'): ProductionRate
{
	const quantityPerSecond = recipe.quantity / recipe.time;
	const rate: ProductionRate = { amount: quantityPerSecond, per: 'second' };
	return convertProductionRate(rate, unit);
}

/**
 * Computes the required output rate (demand) of a node’s item, expressed
 * relative to the root node’s target production rate.
 *
 * Demand is calculated by determining how many units of the node’s item
 * are required per unit of root output, based on the selected recipes
 * throughout the tree, and then scaling that ratio by the global target rate.
 *
 * The returned production rate always uses the same time unit as
 * `state.rate.per`.
 *
 * @param state  The current state of the recipe tree.
 * @param nodeId The ID of the node for which to compute demand.
 *
 * @returns The required production rate of the node’s item.
 *
 * @throws If the root node has no selected recipe or produces zero quantity.
 */
export function getNodeDemand(state: RecipeTreeState, nodeId: RecipeTreeNode['id']): ProductionRate
{
	const root = ensureNode(state, state.rootNodeId);
	const rootRecipe = findSelectedRecipe(root);

	if (!rootRecipe || rootRecipe.quantity <= 0)
	{
		throw new Error('Root node has no selected recipe.');
	}

	const requiredCount = getResolvedQuantity(state, nodeId);
	const ratio = requiredCount / rootRecipe.quantity;

	return { amount: state.rate.amount * ratio, per: state.rate.per };
}

/**
 * Computes how many producer instances are required to satisfy the output
 * demand of a given node.
 *
 * A producer represents a single machine (or equivalent unit) executing the
 * node’s selected recipe continuously. The calculation is performed by:
 *
 *   demand rate ÷ single-producer throughput
 *
 * Demand is derived from the recipe tree and expressed relative to the
 * global target rate. Throughput is derived from the selected recipe.
 *
 * @param state  The current state of the recipe tree.
 * @param nodeId The ID of the node for which to calculate required producers.
 *
 * @returns The number of producers required to meet the node’s demand.
 *
 * @throws If the node has no selected recipe (i.e. it cannot be produced).
 */
export function getRequiredProducers(state: RecipeTreeState, nodeId: RecipeTreeNode['id']): number
{
	const recipe = findSelectedRecipe(ensureNode(state, nodeId));

	if (!recipe)
	{
		throw new Error(`Node with id "${nodeId}" has no selected recipe.`);
	}

	const demand = getNodeDemand(state, nodeId);

	const demandPerSecond = convertProductionRate(demand, 'second').amount;
	const recipeThroughput = getRecipeThroughput(recipe, 'second').amount;

	return demandPerSecond / recipeThroughput;
}

/**
 * Calculates the Bill Of Materials (BOM) for a recipe tree.
 * Traverses the tree, collects all leaf nodes (raw materials),
 * and sums their demand by item type.
 *
 * @param state The recipe tree state.
 * @returns Array of { item, demand } for each leaf item.
 */
export function calculateBillOfMaterials(state: RecipeTreeState): BillOfMaterials
{
	const leafNodes: RecipeTreeNode[] = [];

	function getSelectedRecipeChildren(node: RecipeTreeNode): RecipeTreeNode['id'][]
	{
		if (node.selectedRecipeId === null)
		{
			return [];
		}
		else
		{
			return node.children[node.selectedRecipeId];
		}
	}

	function collectLeaf(node: RecipeTreeNode)
	{
		if (getSelectedRecipeChildren(node).length === 0)
		{
			leafNodes.push(node);
		}
	}

	dfs(state, state.rootNodeId, collectLeaf, getSelectedRecipeChildren, 'pre');

	const bomMap = new Map<Item['id'], BillOfMaterialsEntry>();

	for (const node of leafNodes)
	{
		// Skip root node if it's a leaf. This can happen if the node we are visualizing is a raw material.
		if (node.id === state.rootNodeId)
		{
			continue;
		}

		const demand = getNodeDemand(state, node.id);

		if (bomMap.has(node.item.id))
		{
			const entry = bomMap.get(node.item.id)!;
			entry.demand.amount += demand.amount;
		}
		else
		{
			bomMap.set(node.item.id, { item: node.item, demand: demand });
		}
	}

	return Array.from(bomMap.values()).sort((a, b) => a.item.name.localeCompare(b.item.name));
}
