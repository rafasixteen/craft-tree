import { Item } from '@/domain/item';

export interface ItemNodeData extends Record<string, unknown>
{
	item: Item | null;
}
