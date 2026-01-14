export interface TreeItemNode
{
	name: string;
	children?: string[];
}

export interface FolderNode
{
	id: string;
	name: string;
	type: 'folder';
	children?: string[];
}

export interface ItemNode
{
	id: string;
	name: string;
	type: 'item';
	children?: string[];
	item: {
		slug: string;
	};
}

export interface RecipeNode
{
	id: string;
	name: string;
	type: 'recipe';
	recipe: {
		slug: string;
	};
}

export type Node = FolderNode | ItemNode | RecipeNode;
