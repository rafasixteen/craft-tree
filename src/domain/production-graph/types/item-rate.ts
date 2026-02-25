import { Item } from '@/domain/item';
import { ProductionRate } from '@/domain/production-graph';

export interface ItemRate extends ProductionRate
{
	itemId: Item['id'];
}
