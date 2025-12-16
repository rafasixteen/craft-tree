export type NodeType = 'folder' | 'item' | 'recipe';

export interface CreateNodeInput
{
	name: string;
	type: NodeType;
	parentId?: string;
	itemId?: string;
	recipeId?: string;
}

export interface UpdateNodeInput
{
	name?: string;
	parentId?: string;
}
