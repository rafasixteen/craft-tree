'use client';

import { getInventoryById } from '@/domain/inventory';
import useSWR from 'swr';

type UseInventoryParams = Partial<Parameters<typeof getInventoryById>[0]>;

export function useInventory({ inventoryId }: UseInventoryParams)
{
	const swrKey = inventoryId ? ['inventory', inventoryId] : null;
	const fetcher = () => (inventoryId ? getInventoryById({ inventoryId }) : null);

	const { data, isLoading, isValidating } = useSWR(swrKey, fetcher);

	return {
		inventory: data,
		isLoading,
		isValidating,
	};
}
