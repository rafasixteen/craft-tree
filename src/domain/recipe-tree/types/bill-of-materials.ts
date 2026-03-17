import { Item } from '@/domain/item';

export interface BillOfMaterialsEntry
{
	item: Item;
	amount: number;
}

export type BillOfMaterials = BillOfMaterialsEntry[];
