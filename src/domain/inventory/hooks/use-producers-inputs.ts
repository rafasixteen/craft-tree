'use client';

import { getProducersInputs } from '@/domain/inventory';

import useSWR from 'swr';

type UseProducersInputsParams = Partial<Parameters<typeof getProducersInputs>[0]>;

export function useProducersInputs({ inventoryId }: UseProducersInputsParams)
{
	const swrKey = inventoryId ? ['producers-inputs', inventoryId] : null;
	const fetcher = () => (inventoryId ? getProducersInputs({ inventoryId }) : null);

	const { data, isLoading, isValidating } = useSWR(swrKey, fetcher);

	return {
		producersInputs: data,
		isLoading,
		isValidating,
	};
}
