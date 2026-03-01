import { ItemRate } from '@/domain/production-graph';

export interface SplitNodeData extends Record<string, unknown>
{
	rates: ItemRate[];
}
