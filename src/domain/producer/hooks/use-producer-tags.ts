'use client';

import { Producer, ProducerTag, getProducerTags, setProducerTags } from '@/domain/producer';
import { Tag } from '@/domain/tag';
import { useCallback } from 'react';
import useSWR from 'swr';

interface SetTagParams
{
	tagIds: Tag['id'][];
}

export function useProducerTags(producerId: Producer['id'])
{
	const swrKey = ['producer-tags', producerId];
	const fetcher = () => getProducerTags({ producerId });

	const { data, mutate } = useSWR(swrKey, fetcher, {
		revalidateOnMount: false,
	});

	const setTags = useCallback(
		function setTags({ tagIds }: SetTagParams)
		{
			mutate(
				async (current = []) =>
				{
					await setProducerTags({ producerId, tagIds });
					return current.map((tag) => (tagIds.includes(tag.tagId) ? { ...tag, selected: true } : { ...tag, selected: false }));
				},
				{
					optimisticData: (current: ProducerTag[] = []) => current.map((tag) => (tagIds.includes(tag.tagId) ? { ...tag, selected: true } : { ...tag, selected: false })),
					rollbackOnError: true,
					revalidate: false,
				},
			);
		},
		[setProducerTags, mutate, producerId],
	);

	return {
		tags: data ?? [],
		setTags,
	};
}
