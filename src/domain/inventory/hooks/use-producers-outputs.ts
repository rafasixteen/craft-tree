'use client';

import { getProducersOutputs } from '@/domain/inventory';

import useSWR from 'swr';

type UseProducersOutputsParams = Partial<Parameters<typeof getProducersOutputs>[0]>;

export function useProducersOutputs({ inventoryId }: UseProducersOutputsParams)
{
	const swrKey = inventoryId ? ['producers-outputs', inventoryId] : null;
	const fetcher = () => (inventoryId ? getProducersOutputs({ inventoryId }) : null);

	const { data, isLoading, isValidating } = useSWR(swrKey, fetcher);

	return {
		producersOutputs: data,
		isLoading,
		isValidating,
	};
}
