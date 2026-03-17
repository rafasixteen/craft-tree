import { Producer } from '@/domain/producer';

export function getProducerHref(producer: Producer)
{
	return `/inventories/${producer.inventoryId}/producers/${producer.id}`;
}
