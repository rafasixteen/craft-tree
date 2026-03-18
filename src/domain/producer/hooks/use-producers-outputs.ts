'use client';

import { getProducersOutputs } from '@/domain/producer';
import useSWR from 'swr';

type UseProducersOutputsParams = Parameters<typeof getProducersOutputs>[0];

type UseProducersOutputsReturn =
	| Awaited<ReturnType<typeof getProducersOutputs>>
	| undefined;

export function useProducersOutputs({
	inventoryId,
}: UseProducersOutputsParams): UseProducersOutputsReturn
{
	const swrKey = ['inventory-producers-outputs', inventoryId];
	const fetcher = () => getProducersOutputs({ inventoryId });

	const { data } = useSWR(swrKey, fetcher, {
		revalidateOnMount: true,
	});

	return data;
}
