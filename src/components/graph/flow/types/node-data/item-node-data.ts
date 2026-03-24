import { Item } from '@/domain/item';
import { ProductionRate } from '@/domain/graph';

export interface ItemNodeData extends Record<string, unknown>
{
	itemId: Item['id'] | null;
	rate: ProductionRate;
}
