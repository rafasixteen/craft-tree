import { ProductionGraph } from '@/domain/production-graph';

export function getProductionGraphHref(productionGraph: ProductionGraph)
{
	return `/inventories/${productionGraph.inventoryId}/production-graphs/${productionGraph.id}`;
}
