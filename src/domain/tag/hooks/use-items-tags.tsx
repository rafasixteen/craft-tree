'use client';

import { getItemsTags } from '@/domain/tag';

import useSWR from 'swr';

type UseItemsTagsParams = Partial<Parameters<typeof getItemsTags>[0]>;

export function useItemsTags({ inventoryId }: UseItemsTagsParams)
{
	const swrKey = inventoryId ? ['items-tags', inventoryId] : null;
	const fetcher = () => (inventoryId ? getItemsTags({ inventoryId }) : null);

	const { data, isLoading, isValidating } = useSWR(swrKey, fetcher);

	return {
		itemsTags: data,
		isLoading,
		isValidating,
	};
}
