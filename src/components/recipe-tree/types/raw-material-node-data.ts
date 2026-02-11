import { Item } from '@/domain/item';
import { BaseNodeData } from '@/components/recipe-tree';

export interface RawMaterialNodeData extends BaseNodeData
{
	item: Item;
}
