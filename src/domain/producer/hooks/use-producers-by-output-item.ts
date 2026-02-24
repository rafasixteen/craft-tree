'use client';

import useSWR from 'swr';
import { getProducersByOutputItem, Producer } from '@/domain/producer';
import { Item } from '@/domain/item';

export function useProducersByOutputItem(itemId?: Item['id'])
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
