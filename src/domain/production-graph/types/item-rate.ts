import { Item } from '@/domain/item';
import { ProductionRate } from '@/domain/production-graph';

export interface ItemRate
{
	itemId: Item['id'];
	rate: ProductionRate;
}
