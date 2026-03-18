'use client';

import { useCurrentInventory } from '@/components/inventory';
import {
	getProducerOutputs,
	Producer,
	useProducersOutputs,
} from '@/domain/producer';

type UseProducerOutputsReturn =
	| Awaited<ReturnType<typeof getProducerOutputs>>
	| undefined;

export function useProducerOutputsV2(
	producerId?: Producer['id'] | null,
): UseProducerOutputsReturn
{
	const inventory = useCurrentInventory();
	const outputs = useProducersOutputs({ inventoryId: inventory.id });

	if (!outputs || !producerId) return undefined;

	return outputs.filter((output) => output.producerId === producerId);
}
