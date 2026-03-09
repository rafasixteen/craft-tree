'use client';

import { useCurrentInventory } from '@/components/inventory';
import { Producer, useProducers } from '@/domain/producer';

export function useProducerV2(producerId?: Producer['id'] | null): Producer | undefined
{
	const inventory = useCurrentInventory();
	const { producers } = useProducers({ inventoryId: inventory.id });

	return producers.find((producer) => producer.id === producerId);
}
