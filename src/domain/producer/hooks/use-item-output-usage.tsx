'use client';

import useSWR from 'swr';
import { getItemOutputUsage } from '@/domain/producer';

type UseItemOutputUsageParams = Parameters<typeof getItemOutputUsage>[0];

export function useItemOutputUsage({ itemId }: UseItemOutputUsageParams)
{
	const swrKey = ['item-output-usage', itemId];
	const fetcher = () => getItemOutputUsage({ itemId });

	const { data, error, isLoading, isValidating } = useSWR(swrKey, fetcher);

	return {
		count: data,
		error,
		isLoading,
		isValidating,
	};
}
