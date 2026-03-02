'use client';

import { useCurrentInventory } from '@/components/inventory';
import { getProducerInputs, Producer, useProducersInputs } from '@/domain/producer';

type UseProducerInputsReturn = Awaited<ReturnType<typeof getProducerInputs>> | undefined;

export function useProducerInputsV2(producerId?: Producer['id']): UseProducerInputsReturn
{
	const inventory = useCurrentInventory();
	const inputs = useProducersInputs({ inventoryId: inventory.id });

	if (!inputs || !producerId) return undefined;

	return inputs.filter((input) => input.producerId === producerId);
}
