export const RecipeTreeNodeType = {
	NODE: 'recipe-tree-node',
	LEAF: 'recipe-tree-leaf-node',
} as const;

export type RecipeTreeNodeType = (typeof RecipeTreeNodeType)[keyof typeof RecipeTreeNodeType];
