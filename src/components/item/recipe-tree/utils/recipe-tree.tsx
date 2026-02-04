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
	public readonly id: string;
	public readonly item: Item;
	public readonly recipes: Recipe[];

	private _parent: RecipeTreeNode | null;
	private _children: RecipeTreeNode[];
	private _selectedRecipeIndex: number;

	private constructor(id: string, item: Item, parent: RecipeTreeNode | null, recipes: Recipe[])
	{
		this.id = id;
		this.item = item;
		this.recipes = recipes;

		this._parent = parent;
		this._children = [];
		this._selectedRecipeIndex = recipes.length === 0 ? -1 : 0;
	}

	public get parent(): RecipeTreeNode | null
	{
		return this._parent;
	}

	public get children(): readonly RecipeTreeNode[]
	{
		return this._children;
	}

	public getDepth(): number
	{
		return this._parent ? this._parent.getDepth() + 1 : 0;
	}

	public isLeaf(): boolean
	{
		return this._children.length === 0;
	}

	public isRoot(): boolean
	{
		return this._parent === null;
	}

	public getSelectedRecipeIndex(): number
	{
		return this._selectedRecipeIndex;
	}

	_setParent(parent: RecipeTreeNode | null): void
	{
		this._parent = parent;
	}

	_addChild(child: RecipeTreeNode): void
	{
		this._children.push(child);
	}

	_removeChild(child: RecipeTreeNode): void
	{
		this._children = this._children.filter((c) => c !== child);
	}

	_setSelectedRecipeIndex(index: number): void
	{
		if (index < 0 || index >= this.recipes.length)
		{
			throw new Error(`RecipeTreeNode: selectedRecipeIndex out of bounds (${index})`);
		}

		this._selectedRecipeIndex = index;
	}

	static create(item: Item, parent: RecipeTreeNode | null, recipes: Recipe[]): RecipeTreeNode
	{
		return new RecipeTreeNode(crypto.randomUUID(), item, parent, recipes);
	}
}

class RecipeTree
{
	private readonly _root: RecipeTreeNode;

	private readonly _itemsMap: Map<Item['id'], Item>;

	private readonly _recipesMap: Map<Item['id'], Recipe[]>;

	private readonly _ingredientsMap: Map<Recipe['id'], Ingredient[]>;

	private _nodes = new Map<RecipeTreeNode['id'], RecipeTreeNode>();

	private _version = 0;

	public constructor(items: Map<Item['id'], Item>, recipes: Map<Item['id'], Recipe[]>, ingredients: Map<Recipe['id'], Ingredient[]>, itemId: Item['id'])
	{
		this._itemsMap = items;
		this._recipesMap = recipes;
		this._ingredientsMap = ingredients;

		const rootItem = items.get(itemId);

		if (!rootItem)
		{
			throw new Error(`RecipeTree: Root item with id "${itemId}" not found in items map.`);
		}

		this._root = this.buildNode(rootItem, null);
	}

	static async create(itemId: Item['id']): Promise<RecipeTree>
	{
		const { itemsMap, recipesMap, ingredientsMap } = await getRecipeTreeDataV2(itemId);
		return new RecipeTree(itemsMap, recipesMap, ingredientsMap, itemId);
	}

	public get root(): RecipeTreeNode
	{
		return this._root;
	}

	public getNodeById(nodeId: RecipeTreeNode['id']): RecipeTreeNode | undefined
	{
		return this._nodes.get(nodeId);
	}

	public addNode(node: RecipeTreeNode): void
	{
		if (!this._nodes.has(node.id))
		{
			this._nodes.set(node.id, node);
		}
	}

	public removeNode(node: RecipeTreeNode): void
	{
		if (!this._nodes.has(node.id))
		{
			return;
		}

		if (node.parent)
		{
			node.parent._removeChild(node);
		}

		this.dfs(
			node,
			(n) =>
			{
				this._nodes.delete(n.id);
			},
			DFSOrder.POST,
		);
	}

	public addChild(parent: RecipeTreeNode, child: RecipeTreeNode): void
	{
		this.addNode(parent);

		if (child.parent && child.parent !== parent)
		{
			child.parent._removeChild(child);
		}

		if (child.parent !== parent)
		{
			child._setParent(parent);
		}

		if (!parent.children.includes(child))
		{
			parent._addChild(child);
		}

		this.addNode(child);
	}

	public removeChild(parent: RecipeTreeNode, child: RecipeTreeNode): void
	{
		if (!this._nodes.has(parent.id))
		{
			return;
		}

		if (child.parent !== parent)
		{
			return;
		}

		parent._removeChild(child);

		this.dfs(
			child,
			(n) =>
			{
				this._nodes.delete(n.id);
			},
			DFSOrder.POST,
		);
	}

	public dfs(startNode: RecipeTreeNode, callback: (node: RecipeTreeNode) => void, order: DFSOrder = DFSOrder.PRE): void
	{
		function traverse(node: RecipeTreeNode): void
		{
			if (order === DFSOrder.PRE)
			{
				callback(node);
			}

			for (const child of node.children)
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

	public selectRecipe(nodeId: RecipeTreeNode['id'], delta: number): void
	{
		const node = this.getNodeById(nodeId);

		if (!node)
		{
			console.warn(`RecipeTree: Node with id "${nodeId}" not found in the tree.`);
			return;
		}

		if (node.recipes.length === 0)
		{
			return;
		}

		const currentIndex = node.getSelectedRecipeIndex();
		const newIndex = (((currentIndex + delta) % node.recipes.length) + node.recipes.length) % node.recipes.length;
		node._setSelectedRecipeIndex(newIndex);

		this.rebuildSubtree(node);
	}

	public getTotalQuantity(node: RecipeTreeNode): number
	{
		if (node.parent === null)
		{
			const selectedRecipeIndex = node.getSelectedRecipeIndex();

			if (selectedRecipeIndex === -1)
			{
				return 0;
			}

			const selectedRecipe = node.recipes[selectedRecipeIndex];
			return selectedRecipe.quantity;
		}
		else
		{
			const parentTotalQuantity = this.getTotalQuantity(node.parent);
			const parentSelectedRecipeIndex = node.parent.getSelectedRecipeIndex();

			if (parentSelectedRecipeIndex === -1)
			{
				return 0;
			}

			const parentSelectedRecipe = node.parent.recipes[parentSelectedRecipeIndex];
			const ingredient = this._ingredientsMap.get(parentSelectedRecipe.id)?.find((ing) => ing.itemId === node.item.id);

			return parentTotalQuantity * ingredient!.quantity;
		}
	}

	public getNodeTime(node: RecipeTreeNode): number
	{
		const selectedRecipeIndex = node.getSelectedRecipeIndex();

		if (selectedRecipeIndex === -1)
		{
			return 0;
		}

		const recipe = node.recipes[selectedRecipeIndex];
		const nodeTotalQuantity = this.getTotalQuantity(node);
		const nodeTime = nodeTotalQuantity * recipe.time;

		return nodeTime;
	}

	public getTotalTime(node: RecipeTreeNode): number
	{
		let totalTime = this.getNodeTime(node);

		for (const child of node.children)
		{
			const childTime = this.getTotalTime(child);
			totalTime += childTime;
		}

		return totalTime;
	}

	public incrementVersion(): void
	{
		this._version++;
	}

	public getVersion(): number
	{
		return this._version;
	}

	private buildNode(item: Item, parent: RecipeTreeNode | null): RecipeTreeNode
	{
		const recipes = this._recipesMap.get(item.id) ?? [];
		const node = RecipeTreeNode.create(item, parent, recipes);

		this.addNode(node);

		if (parent)
		{
			this.addChild(parent, node);
		}

		if (recipes.length > 0)
		{
			const selectedRecipe = recipes[node.getSelectedRecipeIndex()];
			const ingredients = this._ingredientsMap.get(selectedRecipe.id) ?? [];

			for (const ingredient of ingredients)
			{
				const childItem = this._itemsMap.get(ingredient.itemId);

				if (!childItem)
				{
					continue;
				}

				this.buildNode(childItem, node);
			}
		}

		return node;
	}

	private rebuildSubtree(node: RecipeTreeNode): void
	{
		while (node.children.length > 0)
		{
			this.removeChild(node, node.children[0]);
		}

		if (node.recipes.length > 0)
		{
			const selectedRecipe = node.recipes[node.getSelectedRecipeIndex()];
			const ingredients = this._ingredientsMap.get(selectedRecipe.id) ?? [];

			for (const ingredient of ingredients)
			{
				const childItem = this._itemsMap.get(ingredient.itemId);

				if (!childItem)
				{
					continue;
				}

				this.buildNode(childItem, node);
			}
		}
	}
}

export { RecipeTreeNode, RecipeTree, DFSOrder };
