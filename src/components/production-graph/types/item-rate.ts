import { ProductionRate } from '@/domain/recipe-tree/types/production-rate';

export interface ItemRate
{
	itemId: string;
	rate: ProductionRate;
}
