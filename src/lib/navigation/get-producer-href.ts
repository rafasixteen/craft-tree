import { Producer } from '@/domain/producer';

export function getProducerHref(producer: Producer, action?: string)
{
	const base = `/inventories/${producer.inventoryId}/producers/${producer.id}`;
	return action ? `${base}/${action}` : base;
}
