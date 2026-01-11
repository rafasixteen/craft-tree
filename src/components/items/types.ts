export type TreeNodeType = 'collection' | 'item' | 'recipe';

export interface TreeNode
{
	id: string;
	name: string;
	type: TreeNodeType;
	slug?: string;
}
