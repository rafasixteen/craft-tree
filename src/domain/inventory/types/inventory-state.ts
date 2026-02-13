import { Item } from '@/domain/item';
import { Producer } from '@/domain/producer';

export interface InventoryState
{
	items: Item[];
	producers: Producer[];
}
