'use client';

import { getProducerTags } from '@/domain/producer';
import useSWR from 'swr';

type UseProducerTagsParams = Partial<Parameters<typeof getProducerTags>[0]>;

export function useProducerTags({ producerId }: UseProducerTagsParams)
{
	const swrKey = producerId ? ['producer-tags', producerId] : null;
	const fetcher = () => (producerId ? getProducerTags({ producerId }) : null);

	const { data, isLoading, isValidating } = useSWR(swrKey, fetcher);

	return {
		tags: data,
		isLoading,
		isValidating,
	};
}
