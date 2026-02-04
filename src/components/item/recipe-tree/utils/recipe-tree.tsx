import { Item } from '@/domain/item';
import { Recipe } from '@/domain/recipe';
import { Ingredient } from '@/domain/ingredient';
import { getRecipeTreeDataV2 } from '@/components/item/recipe-tree';

/**
 * Determines the order in which nodes are visited during a DFS traversal.
 */
enum DFSOrder
{
	/**
	 * Pre-order DFS:
	 * - The callback is invoked on the **parent node first**, before visiting any children.
	 * - Useful for:
	 *   - Rendering trees
	 *   - Building node IDs or paths
	 *   - Logging or inspecting structure
	 *
	 * Example visit order:
	 * Root → Child1 → Grandchild1 → Grandchild2 → Child2
	 */
	PRE = 'pre',

	/**
	 * Post-order DFS:
	 * - The callback is invoked on the **parent node after all children have been visited**.
	 * - Useful for:
	 *   - Aggregating values (totals, costs, quantities)
	 *   - Bottom-up calculations
	 *   - Cleanup or deletion of nodes
	 *
	 * Example visit order:
	 * Grandchild1 → Grandchild2 → Child1 → Child2 → Root
	 */
	POST = 'post',
}

class RecipeTreeNode
{
	readonly id: string;

	readonly parent: RecipeTreeNode | null;

	private children: RecipeTreeNode[];

	readonly item: Item;

	readonly recipe?: {
		recipes: Recipe[];

		selectedRecipe: Recipe;

		ingredients: Ingredient[];
	};

	constructor(
		id: string,
		item: Item,
		parent: RecipeTreeNode | null,
		recipe?: {
			recipes: Recipe[];
			selectedRecipe: Recipe;
			ingredients: Ingredient[];
		},
	)
	{
		this.id = id;
		this.item = item;
		this.parent = parent;
		this.children = [];
		this.recipe = recipe;
	}

	getChildren(): RecipeTreeNode[]
	{
		return this.children;
	}

	setChildren(children: RecipeTreeNode[]): void
	{
		this.children = children;
	}

	addChild(child: RecipeTreeNode): void
	{
		this.children.push(child);
	}

	removeChild(child: RecipeTreeNode): void
	{
		this.children = this.children.filter((c) => c !== child);
	}

	getParent(): RecipeTreeNode | null
	{
		return this.parent;
	}

	getDepth(): number
	{
		return this.parent ? this.parent.getDepth() + 1 : 0;
	}

	isLeaf(): boolean
	{
		return this.children.length === 0;
	}

	isRoot(): boolean
	{
		return this.parent === null;
	}

	selectRecipe(delta: number): void
	{
		if (!this.recipe)
		{
			console.warn('Cannot select recipe on a node without recipes.');
			return;
		}

		const currentIndex = this.recipe.recipes.indexOf(this.recipe.selectedRecipe);
		const recipesCount = this.recipe.recipes.length;

		if (recipesCount === 0 || delta === 0)
		{
			return;
		}

		const nextIndex = (((currentIndex + delta) % recipesCount) + recipesCount) % recipesCount;
		this.recipe.selectedRecipe = this.recipe.recipes[nextIndex];
	}

	getSelectedRecipeIndex(): number
	{
		if (!this.recipe)
		{
			return -1;
		}

		return this.recipe.recipes.indexOf(this.recipe.selectedRecipe);
	}

	static create(
		item: Item,
		parent: RecipeTreeNode | null,
		recipe?: {
			recipes: Recipe[];
			selectedRecipe: Recipe;
			ingredients: Ingredient[];
		},
	): RecipeTreeNode
	{
		return new RecipeTreeNode(crypto.randomUUID(), item, parent, recipe);
	}
}

class RecipeTree
{
	readonly root: RecipeTreeNode;

	private nodes = new Map<RecipeTreeNode['id'], RecipeTreeNode>();

	constructor(rootNode: RecipeTreeNode)
	{
		this.root = rootNode;
		this.registerNode(rootNode);
	}

	getNodeById(nodeId: RecipeTreeNode['id']): RecipeTreeNode | undefined
	{
		return this.nodes.get(nodeId);
	}

	registerNode(node: RecipeTreeNode): void
	{
		this.nodes.set(node.id, node);
	}

	dfs(startNode: RecipeTreeNode, callback: (node: RecipeTreeNode) => void, order: DFSOrder = DFSOrder.PRE): void
	{
		function traverse(node: RecipeTreeNode): void
		{
			if (order === DFSOrder.PRE)
			{
				callback(node);
			}

			for (const child of node.getChildren())
			{
				traverse(child);
			}

			if (order === DFSOrder.POST)
			{
				callback(node);
			}
		}

		traverse(startNode);
	}

	static async fromItem(rootItem: Item): Promise<RecipeTree>
	{
		const { itemsMap, recipesMap, ingredientsMap } = await getRecipeTreeDataV2(rootItem.id);

		// Create root node with recipe data
		const rootItemRecipes = recipesMap.get(rootItem.id) ?? [];
		const rootItemSelectedRecipe = rootItemRecipes[0];
		const rootItemIngredients = rootItemSelectedRecipe ? (ingredientsMap.get(rootItemSelectedRecipe.id) ?? []) : [];

		const rootNodeRecipe = rootItemSelectedRecipe
			? {
					recipes: rootItemRecipes,
					selectedRecipe: rootItemSelectedRecipe,
					ingredients: rootItemIngredients,
				}
			: undefined;

		const rootNode = RecipeTreeNode.create(rootItem, null, rootNodeRecipe);

		const tree = new RecipeTree(rootNode);

		// Recursively build the tree structure
		const buildSubtree = (node: RecipeTreeNode): void =>
		{
			const selectedRecipe = node.recipe?.selectedRecipe;

			if (!selectedRecipe)
			{
				return;
			}

			const recipeIngredients = ingredientsMap.get(selectedRecipe.id) ?? [];

			for (const ingredient of recipeIngredients)
			{
				const childItem = itemsMap.get(ingredient.itemId);

				if (!childItem)
				{
					continue;
				}

				const ingredientItemRecipes = recipesMap.get(childItem.id) ?? [];
				const selectedIngItemRecipe = ingredientItemRecipes[0];
				const selectedIngItemRecipeIngs = selectedIngItemRecipe ? (ingredientsMap.get(selectedIngItemRecipe.id) ?? []) : [];

				const childNode = selectedIngItemRecipe
					? RecipeTreeNode.create(childItem, node, {
							recipes: ingredientItemRecipes,
							selectedRecipe: selectedIngItemRecipe,
							ingredients: selectedIngItemRecipeIngs,
						})
					: RecipeTreeNode.create(childItem, node);

				node.addChild(childNode);
				tree.registerNode(childNode);

				// Recursively build subtree for child
				buildSubtree(childNode);
			}
		};

		// Build the tree starting from root
		buildSubtree(rootNode);

		return tree;
	}
}

export { RecipeTreeNode, RecipeTree, DFSOrder };
