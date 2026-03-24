'use client';

import useSWR from 'swr';
import { getItemProducerInputUsage } from '@/domain/item';

type UseItemProducerInputUsageParams = Partial<Parameters<typeof getItemProducerInputUsage>[0]>;

export function useItemProducerInputUsage({ itemId }: UseItemProducerInputUsageParams)
{
	const swrKey = itemId ? ['item-producer-input-usage', itemId] : null;
	const fetcher = () => (itemId ? getItemProducerInputUsage({ itemId }) : null);

	const { data, isLoading, isValidating } = useSWR(swrKey, fetcher);

	return {
		count: data,
		isLoading,
		isValidating,
	};
}
