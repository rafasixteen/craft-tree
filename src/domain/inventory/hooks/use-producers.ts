'use client';

import { getProducers } from '@/domain/inventory';
import useSWR from 'swr';

type UseProducersParams = Partial<Parameters<typeof getProducers>[0]>;

export function useProducers({ inventoryId }: UseProducersParams)
{
	const swrKey = inventoryId ? ['producers', inventoryId] : null;
	const fetcher = () => (inventoryId ? getProducers({ inventoryId }) : null);

	const { data, isLoading, isValidating } = useSWR(swrKey, fetcher);

	return {
		producers: data,
		isLoading,
		isValidating,
	};
}
