'use client';

import { Item, ItemTag, getItemTags, setItemTags } from '@/domain/item';
import { Tag } from '@/domain/tag';
import { useCallback } from 'react';
import useSWR from 'swr';

interface SetTagParams
{
	tagIds: Tag['id'][];
}

export function useItemTags(itemId: Item['id'])
{
	const swrKey = ['item-tags', itemId];
	const fetcher = () => getItemTags({ itemId });

	const { data, mutate } = useSWR(swrKey, fetcher, {
		revalidateOnMount: false,
	});

	const setTags = useCallback(
		function setTags({ tagIds }: SetTagParams)
		{
			mutate(
				async (current = []) =>
				{
					await setItemTags({ itemId, tagIds });
					return current.map((tag) => (tagIds.includes(tag.tagId) ? { ...tag, selected: true } : { ...tag, selected: false }));
				},
				{
					optimisticData: (current: ItemTag[] = []) => current.map((tag) => (tagIds.includes(tag.tagId) ? { ...tag, selected: true } : { ...tag, selected: false })),
					rollbackOnError: true,
					revalidate: false,
				},
			);
		},
		[setItemTags, mutate, itemId],
	);

	return {
		tags: data ?? [],
		setTags,
	};
}
