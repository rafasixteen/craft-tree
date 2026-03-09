import { Item } from '@/domain/item';
import { ProductionRate } from '@/domain/production-graph';

export interface SplitNodeData extends Record<string, unknown>
{
	itemId: Item['id'] | null;
	rates: ProductionRate[];
}
