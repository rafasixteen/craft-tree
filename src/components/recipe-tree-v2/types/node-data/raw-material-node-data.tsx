import { Item } from '@/domain/item';

export interface RawMaterialNodeData extends Record<string, unknown>
{
	itemId: Item['id'];
}
