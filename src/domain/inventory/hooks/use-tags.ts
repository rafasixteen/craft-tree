'use client';

import { getTags } from '@/domain/inventory';
import useSWR from 'swr';

type UseTagsParams = Partial<Parameters<typeof getTags>[0]>;

export function useTags({ inventoryId }: UseTagsParams)
{
	const swrKey = inventoryId ? ['tags', inventoryId] : null;
	const fetcher = () => (inventoryId ? getTags({ inventoryId }) : null);

	const { data, isLoading, isValidating } = useSWR(swrKey, fetcher);

	return {
		tags: data,
		isLoading,
		isValidating,
	};
}
