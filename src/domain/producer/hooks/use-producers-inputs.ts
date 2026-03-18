'use client';

import { getProducersInputs } from '@/domain/producer';
import useSWR from 'swr';

type UseProducersInputsParams = Parameters<typeof getProducersInputs>[0];

type UseProducersInputsReturn =
	| Awaited<ReturnType<typeof getProducersInputs>>
	| undefined;

export function useProducersInputs({
	inventoryId,
}: UseProducersInputsParams): UseProducersInputsReturn
{
	const swrKey = ['inventory-producers-inputs', inventoryId];
	const fetcher = () => getProducersInputs({ inventoryId });

	const { data } = useSWR(swrKey, fetcher, {
		revalidateOnMount: true,
	});

	return data;
}
