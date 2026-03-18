'use client';

import { Item, getItemTags, setItemTags } from '@/domain/item';

import useSWR from 'swr';
import { useCallback } from 'react';

type SetTagsParams = Omit<Parameters<typeof setItemTags>[0], 'itemId'>;

export function useItemTags(itemId: Item['id'])
{
	const swrKey = ['item-tags', itemId];
	const fetcher = () => getItemTags(itemId);

	const { data, mutate } = useSWR(swrKey, fetcher, {
		revalidateOnMount: true,
	});

	const setTags = useCallback(
		async function setTags({ tagIds }: SetTagsParams)
		{
			const optimistic = tagIds.map((tagId) => ({
				tagId,
				itemId,
			}));

			mutate(
				async () =>
				{
					return await setItemTags({ itemId, tagIds });
				},
				{
					optimisticData: optimistic,
					rollbackOnError: true,
					populateCache: true,
				},
			);
		},
		[itemId, mutate],
	);

	if (!data)
	{
		throw new Error(
			'Item tags not found. This hook must be used within a component wrapped by a <ItemLayout> that provides the item tags data via SWR fallback.',
		);
	}

	return {
		tags: data,
		setTags,
	};
}
