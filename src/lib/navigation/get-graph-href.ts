import { Graph } from '@/domain/graph';

export function getGraphHref(graph: Graph, action?: string)
{
	const base = `/inventories/${graph.inventoryId}/graphs/${graph.id}`;
	return action ? `${base}/${action}` : base;
}
