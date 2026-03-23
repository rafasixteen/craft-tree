import { ProductionGraph } from '@/domain/production-graph';

export function getProductionGraphHref(productionGraph: ProductionGraph, action?: string)
{
	const base = `/inventories/${productionGraph.inventoryId}/production-graphs/${productionGraph.id}`;
	return action ? `${base}/${action}` : base;
}
