'use client';

import { getItemTags } from '@/domain/item';
import useSWR from 'swr';

type UseItemTagsParams = Partial<Parameters<typeof getItemTags>[0]>;

export function useItemTags({ itemId }: UseItemTagsParams)
{
	const swrKey = itemId ? ['item-tags', itemId] : null;
	const fetcher = () => (itemId ? getItemTags({ itemId }) : null);

	const { data, isLoading, isValidating } = useSWR(swrKey, fetcher);

	return {
		tags: data,
		isLoading,
		isValidating,
	};
}
