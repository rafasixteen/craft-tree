'use client';

import { ProducerTag } from '@/domain/producer';
import { getProducersTags } from '@/domain/tag';

import useSWR from 'swr';

type UseProducersTagsParams = Parameters<typeof getProducersTags>[0];

export function useProducersTags({ inventoryId }: UseProducersTagsParams)
{
	const swrKey = ['inventory-producers-tags', inventoryId];
	const fetcher = () => getProducersTags({ inventoryId });

	const { data } = useSWR<ProducerTag[]>(swrKey, fetcher);
	return data ?? [];
}
