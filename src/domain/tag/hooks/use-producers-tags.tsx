'use client';

import { getProducersTags } from '@/domain/tag';

import useSWR from 'swr';

type UseProducersTagsParams = Partial<Parameters<typeof getProducersTags>[0]>;

export function useProducersTags({ inventoryId }: UseProducersTagsParams)
{
	const swrKey = inventoryId ? ['producers-tags', inventoryId] : null;
	const fetcher = () => (inventoryId ? getProducersTags({ inventoryId }) : null);

	const { data, isLoading, isValidating } = useSWR(swrKey, fetcher);

	return {
		producersTags: data,
		isLoading,
		isValidating,
	};
}
