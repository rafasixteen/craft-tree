'use client';

import { Producer, getProducerTags, setProducerTags } from '@/domain/producer';

import useSWR from 'swr';
import { useCallback } from 'react';

type SetTagsParams = Omit<Parameters<typeof setProducerTags>[0], 'producerId'>;

export function useProducerTags(producerId: Producer['id'])
{
	const swrKey = ['producer-tags', producerId];
	const fetcher = () => getProducerTags(producerId);

	const { data, mutate } = useSWR(swrKey, fetcher, {
		revalidateOnMount: true,
	});

	const setTags = useCallback(
		async function setTags({ tagIds }: SetTagsParams)
		{
			const optimistic = tagIds.map((tagId) => ({
				tagId,
				producerId,
			}));

			mutate(
				async () =>
				{
					return await setProducerTags({ producerId, tagIds });
				},
				{
					optimisticData: optimistic,
					rollbackOnError: true,
					populateCache: true,
				},
			);
		},
		[producerId, mutate],
	);

	if (!data)
	{
		throw new Error(
			'Producer tags not found. This hook must be used within a component wrapped by a <ProducerLayout> that provides the producer tags data via SWR fallback.',
		);
	}

	return {
		tags: data,
		setTags,
	};
}
