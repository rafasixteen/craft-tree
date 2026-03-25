'use client';

import { getItemById } from '@/domain/item';
import useSWR from 'swr';

type UseItemParams = Partial<Parameters<typeof getItemById>[0]>;

export function useItem({ itemId }: UseItemParams)
{
	const swrKey = itemId ? ['item', itemId] : null;
	const fetcher = () => (itemId ? getItemById({ itemId }) : null);

	const { data, isLoading, isValidating } = useSWR(swrKey, fetcher);

	return {
		item: data,
		isLoading,
		isValidating,
	};
}
