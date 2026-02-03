export const RecipeTreeNodeType = {
	ROOT: 'recipe-tree-root-node',
	NODE: 'recipe-tree-node',
	LEAF: 'recipe-tree-leaf-node',
} as const;

export type RecipeTreeNodeType = (typeof RecipeTreeNodeType)[keyof typeof RecipeTreeNodeType];
