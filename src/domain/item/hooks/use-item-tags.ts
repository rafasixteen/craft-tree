'use client';

import { Item, getItemTags } from '@/domain/item';
import useSWR from 'swr';

interface UseItemTagsParams
{
	itemId?: Item['id'] | null;
}

export function useItemTags({ itemId }: UseItemTagsParams)
{
	const swrKey = itemId ? ['item-tags', itemId] : null;
	const fetcher = () => (itemId ? getItemTags(itemId) : null);

	const { data, isLoading, isValidating } = useSWR(swrKey, fetcher);

	return {
		tags: data,
		isLoading,
		isValidating,
	};
}
