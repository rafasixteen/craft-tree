import { Item } from '@/domain/item';

export interface RecipeTreeLeafNodeData extends Record<string, unknown>
{
	itemId: Item['id'];
}
