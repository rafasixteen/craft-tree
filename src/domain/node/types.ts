import { Item } from '@domain/item';
import { Recipe } from '@domain/recipe';

export type NodeType = 'folder' | 'item' | 'recipe';

export interface Node
{
	id: string;
	name: string;
	type: NodeType;
	order: number;
	item: Item | null;
	recipe: Recipe | null;
	children: Node[];
	parent: Node | null;
}

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
