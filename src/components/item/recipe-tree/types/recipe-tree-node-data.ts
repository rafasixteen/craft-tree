import { Item } from '@/domain/item';

export interface RecipeTreeNodeData extends Record<string, unknown>
{
	item: Item;
}
