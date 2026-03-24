'use client';

import useSWR from 'swr';
import { getItemProducerOutputUsage } from '@/domain/item';

type UseItemProducerOutputUsageParams = Partial<Parameters<typeof getItemProducerOutputUsage>[0]>;

export function useItemProducerOutputUsage({ itemId }: UseItemProducerOutputUsageParams)
{
	const swrKey = itemId ? ['item-producer-output-usage', itemId] : null;
	const fetcher = () => (itemId ? getItemProducerOutputUsage({ itemId }) : null);

	const { data, isLoading, isValidating } = useSWR(swrKey, fetcher);

	return {
		count: data,
		isLoading,
		isValidating,
	};
}
