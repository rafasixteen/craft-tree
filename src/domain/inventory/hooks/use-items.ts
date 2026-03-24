'use client';

import { getItems } from '@/domain/inventory';
import useSWR from 'swr';

type UseItemsParams = Partial<Parameters<typeof getItems>[0]>;

export function useItems({ inventoryId }: UseItemsParams)
{
	const swrKey = inventoryId ? ['items', inventoryId] : null;
	const fetcher = () => (inventoryId ? getItems({ inventoryId }) : null);

	const { data, isLoading, isValidating } = useSWR(swrKey, fetcher);

	return {
		items: data,
		isLoading,
		isValidating,
	};
}
