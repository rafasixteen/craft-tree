import { Item } from '@/domain/item';
import { ProductionRate } from '@/domain/graph';

export interface ItemRate extends ProductionRate
{
	itemId: Item['id'];
}
