import { Item } from '@/domain/item';
import { ProductionRate } from '@/domain/production-graph';

export interface ItemNodeData extends Record<string, unknown>
{
	item: Item | null;
	rate: ProductionRate;
	readonly?: boolean;
}
