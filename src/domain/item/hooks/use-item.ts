'use client';

import { getItemById, Item } from '@/domain/item';
import useSWR from 'swr';

interface UseItemParams
{
	itemId?: Item['id'] | null;
}

export function useItem({ itemId }: UseItemParams)
{
	const swrKey = itemId ? ['item', itemId] : null;
	const fetcher = () => (itemId ? getItemById(itemId) : null);

	const { data, isLoading, isValidating } = useSWR(swrKey, fetcher);

	return {
		item: data,
		isLoading,
		isValidating,
	};
}
