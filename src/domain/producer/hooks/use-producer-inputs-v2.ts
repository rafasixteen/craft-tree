'use client';

import { useCurrentInventory } from '@/components/inventory';

import { Producer, getProducerInputs, useProducersInputs } from '@/domain/producer';

type UseProducerInputsReturn = Awaited<ReturnType<typeof getProducerInputs>> | undefined;

export function useProducerInputsV2(producerId?: Producer['id'] | null): UseProducerInputsReturn
{
	const inventory = useCurrentInventory();
	const inputs = useProducersInputs({ inventoryId: inventory.id });

	if (!inputs || !producerId) return undefined;

	return inputs.filter((input) => input.producerId === producerId);
}
