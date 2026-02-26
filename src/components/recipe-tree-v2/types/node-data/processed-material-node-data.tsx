import { Item } from '@/domain/item';

export interface ProcessedMaterialNodeData extends Record<string, unknown>
{
	itemId: Item['id'];
}
