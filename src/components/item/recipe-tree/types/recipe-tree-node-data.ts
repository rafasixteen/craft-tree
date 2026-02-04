import { RecipeTreeNode } from '@/components/item/recipe-tree';

export interface RecipeTreeNodeData extends Record<string, unknown>
{
	node: RecipeTreeNode;
}
