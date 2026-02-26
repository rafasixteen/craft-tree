import { Item } from '@/domain/item';
import { ProductionRate } from '@/domain/production-graph';

export interface BillOfMaterialsEntry
{
	item: Item;
	demand: ProductionRate;
}

export type BillOfMaterials = BillOfMaterialsEntry[];
