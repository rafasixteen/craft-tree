'use client';

import useSWR from 'swr';
import { getInventoriesByUserId } from '@/domain/inventory';

type UseInventoriesParams = Partial<Parameters<typeof getInventoriesByUserId>[0]>;

export function useInventories({ userId }: UseInventoriesParams)
{
	const swrKey = userId ? ['inventories', userId] : null;
	const fetcher = () => (userId ? getInventoriesByUserId({ userId }) : null);

	const { data, isLoading, isValidating } = useSWR(swrKey, fetcher);

	return {
		inventories: data,
		isLoading,
		isValidating,
	};
}
