import { ProductionRate } from '@/domain/production-graph';

export interface ProductionRateNodeData extends Record<string, unknown>
{
	rate: ProductionRate;
	readonly?: boolean;
}
