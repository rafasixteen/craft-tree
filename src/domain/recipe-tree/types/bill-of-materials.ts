import { Item } from '@/domain/item';
import { ProductionRate } from '@/domain/recipe-tree';

export interface BillOfMaterialsEntry
{
	item: Item;
	demand: ProductionRate;
}

export type BillOfMaterials = BillOfMaterialsEntry[];
