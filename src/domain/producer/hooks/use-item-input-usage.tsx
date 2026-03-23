'use client';

import useSWR from 'swr';
import { getItemInputUsage } from '@/domain/producer';

type UseItemInputUsageParams = Parameters<typeof getItemInputUsage>[0];

export function useItemInputUsage({ itemId }: UseItemInputUsageParams)
{
	const swrKey = ['item-input-usage', itemId];
	const fetcher = () => getItemInputUsage({ itemId });

	const { data, error, isLoading, isValidating } = useSWR(swrKey, fetcher);

	return {
		count: data,
		error,
		isLoading,
		isValidating,
	};
}
