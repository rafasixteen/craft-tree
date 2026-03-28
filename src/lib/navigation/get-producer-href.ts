import { Inventory } from '@/domain/inventory';
import { Producer } from '@/domain/producer';
import { getInventoryHref } from '@/lib/navigation';

interface GetProducerHrefParams
{
	inventoryId: Inventory['id'];
	producerId: Producer['id'];
	path?: string[];
}

export function getProducerHref({ inventoryId, producerId, path }: GetProducerHrefParams)
{
	const producerPath = ['producers', producerId];
	const fullPath = [...producerPath, ...(path || [])];
	return getInventoryHref({ inventoryId, path: fullPath });
}
