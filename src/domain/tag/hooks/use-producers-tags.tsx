'use client';

import useSWR from 'swr';
import { ProducerTag } from '@/domain/producer';
import { getProducersTags } from '@/domain/tag';

type UseProducersTagsParams = Parameters<typeof getProducersTags>[0];

export function useProducersTags({ inventoryId }: UseProducersTagsParams)
{
	const swrKey = ['inventory-producers-tags', inventoryId];
	const fetcher = () => getProducersTags({ inventoryId });

	const { data } = useSWR<ProducerTag[]>(swrKey, fetcher);
	return data ?? [];
}
