import { Item } from '@/domain/item';
import { ProductionRate } from '@/domain/production-graph';

export interface ItemNodeData extends Record<string, unknown>
{
	itemId: Item['id'] | null;
	rate: ProductionRate;
}
