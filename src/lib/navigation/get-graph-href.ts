import { Inventory } from '@/domain/inventory';
import { Graph } from '@/domain/graph';
import { getInventoryHref } from '@/lib/navigation';

interface GetGraphHrefParams
{
	inventoryId: Inventory['id'];
	graphId: Graph['id'];
	path?: string[];
}

export function getGraphHref({ inventoryId, graphId, path }: GetGraphHrefParams)
{
	const graphPath = ['graphs', graphId];
	const fullPath = [...graphPath, ...(path || [])];
	return getInventoryHref({ inventoryId, path: fullPath });
}
