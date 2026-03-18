'use client';

import { Item } from '@/domain/item';
import { Producer, getProducersByOutputItem } from '@/domain/producer';

import useSWR from 'swr';

export function useProducersByOutputItem(itemId?: Item['id'] | null)
{
	const key = itemId ? ['producers-by-output-item', itemId] : null;
	const fetcher = () => (itemId ? getProducersByOutputItem({ itemId }) : Promise.resolve([]));

	const { data } = useSWR<Producer[]>(key, fetcher, {
		revalidateOnMount: true,
	});

	return {
		producers: data ?? [],
	};
}
