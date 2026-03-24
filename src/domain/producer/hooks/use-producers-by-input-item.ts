'use client';

import { getProducersByInputItem } from '@/domain/producer';
import useSWR from 'swr';

type UseProducersByInputItemParams = Partial<Parameters<typeof getProducersByInputItem>[0]>;

export function useProducersByInputItem({ itemId }: UseProducersByInputItemParams)
{
	const key = itemId ? ['producers-by-input-item', itemId] : null;
	const fetcher = () => (itemId ? getProducersByInputItem({ itemId }) : null);

	const { data, isLoading, isValidating } = useSWR(key, fetcher);

	return {
		producers: data,
		isLoading,
		isValidating,
	};
}
