import { Item } from '@/domain/item';
import { Recipe } from '@/domain/recipe';
import { Ingredient } from '@/domain/ingredient';
import { getRecipeTreeDataV2 } from '@/components/item/recipe-tree';

interface RecipeWithIngredients extends Recipe
{
	ingredients: Ingredient[];
}

type TreeListener = () => void;

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
	public readonly id: string;

	public readonly parent: RecipeTreeNode | null;

	private children: RecipeTreeNode[];

	public readonly item: Item;

	public readonly recipes: RecipeWithIngredients[];

	public selectedRecipeIndex: number;

	public constructor(id: string, item: Item, parent: RecipeTreeNode | null, recipes: RecipeWithIngredients[], selectedRecipeIndex: number)
	{
		this.id = id;
		this.item = item;
		this.parent = parent;
		this.children = [];
		this.recipes = recipes;
		this.selectedRecipeIndex = selectedRecipeIndex;
	}

	public getChildren(): RecipeTreeNode[]
	{
		return this.children;
	}

	public setChildren(children: RecipeTreeNode[]): void
	{
		this.children = children;
	}

	public addChild(child: RecipeTreeNode): void
	{
		this.children.push(child);
	}

	public removeChild(child: RecipeTreeNode): void
	{
		this.children = this.children.filter((c) => c !== child);
	}

	public getParent(): RecipeTreeNode | null
	{
		return this.parent;
	}

	public getDepth(): number
	{
		return this.parent ? this.parent.getDepth() + 1 : 0;
	}

	public isLeaf(): boolean
	{
		return this.children.length === 0;
	}

	public isRoot(): boolean
	{
		return this.parent === null;
	}

	public static create(item: Item, parent: RecipeTreeNode | null, recipes: RecipeWithIngredients[], selectedRecipeIndex: number): RecipeTreeNode
	{
		return new RecipeTreeNode(crypto.randomUUID(), item, parent, recipes, selectedRecipeIndex);
	}
}

class RecipeTree
{
	public readonly root: RecipeTreeNode;

	private nodes = new Map<RecipeTreeNode['id'], RecipeTreeNode>();
	private version = 0;

	private listeners = new Set<TreeListener>();

	public constructor(rootNode: RecipeTreeNode)
	{
		this.root = rootNode;
		this.registerNode(rootNode);
	}

	public getNodeById(nodeId: RecipeTreeNode['id']): RecipeTreeNode | undefined
	{
		return this.nodes.get(nodeId);
	}

	public registerNode(node: RecipeTreeNode): void
	{
		this.nodes.set(node.id, node);
	}

	public getVersion(): number
	{
		return this.version;
	}

	public selectRecipe(nodeId: RecipeTreeNode['id'], delta: number): void
	{
		const node = this.getNodeById(nodeId);

		if (!node)
		{
			console.warn(false, `RecipeTree: Node with id "${nodeId}" not found in the tree.`);
			return;
		}

		if (node.recipes.length === 0)
		{
			return;
		}

		const newIndex = (((node.selectedRecipeIndex + delta) % node.recipes.length) + node.recipes.length) % node.recipes.length;
		node.selectedRecipeIndex = newIndex;

		this.notify();
	}

	public subscribe(listener: TreeListener): () => void
	{
		this.listeners.add(listener);
		return () => this.listeners.delete(listener);
	}

	public dfs(startNode: RecipeTreeNode, callback: (node: RecipeTreeNode) => void, order: DFSOrder = DFSOrder.PRE): void
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

	private notify(): void
	{
		this.version += 1;
		for (const listener of this.listeners)
		{
			listener();
		}
	}

	public static async fromItem(rootItem: Item): Promise<RecipeTree>
	{
		const { itemsMap, recipesMap, ingredientsMap } = await getRecipeTreeDataV2(rootItem.id);

		const rootItemRecipes: RecipeWithIngredients[] = (recipesMap.get(rootItem.id) ?? []).map((recipe) => ({
			...recipe,
			ingredients: ingredientsMap.get(recipe.id) ?? [],
		}));

		const rootNode = RecipeTreeNode.create(rootItem, null, rootItemRecipes, 0);

		const tree = new RecipeTree(rootNode);

		// Recursively build the tree structure
		const buildSubtree = (node: RecipeTreeNode): void =>
		{
			const selectedRecipe = node.recipes[node.selectedRecipeIndex];

			if (!selectedRecipe)
			{
				return;
			}

			for (const ingredient of selectedRecipe.ingredients)
			{
				const childItem = itemsMap.get(ingredient.itemId);

				if (!childItem)
				{
					continue;
				}

				const childItemRecipes: RecipeWithIngredients[] = (recipesMap.get(childItem.id) ?? []).map((recipe) => ({
					...recipe,
					ingredients: ingredientsMap.get(recipe.id) ?? [],
				}));

				const childNode = RecipeTreeNode.create(childItem, node, childItemRecipes, 0);

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
