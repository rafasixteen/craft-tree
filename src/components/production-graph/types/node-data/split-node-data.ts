import { ProductionRate } from '@/domain/production-graph';

export interface SplitNodeData extends Record<string, unknown>
{
	outputs: ProductionRate[];
}
