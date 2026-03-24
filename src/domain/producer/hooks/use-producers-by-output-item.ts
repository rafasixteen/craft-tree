'use client';

import { getProducersByOutputItem } from '@/domain/producer';
import useSWR from 'swr';

type UseProducersByOutputItemParams = Partial<Parameters<typeof getProducersByOutputItem>[0]>;

export function useProducersByOutputItem({ itemId }: UseProducersByOutputItemParams)
{
	const key = itemId ? ['producers-by-output-item', itemId] : null;
	const fetcher = () => (itemId ? getProducersByOutputItem({ itemId }) : null);

	const { data, isLoading, isValidating } = useSWR(key, fetcher);

	return {
		producers: data,
		isLoading,
		isValidating,
	};
}
