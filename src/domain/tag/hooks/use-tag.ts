'use client';

import { Tag } from '@/domain/tag';
import { useCallback } from 'react';
import * as TagServerActions from '@/domain/tag/server';
import useSWR from 'swr';

type UpdateTagParams = Omit<Parameters<typeof TagServerActions.updateTag>[0], 'id'>;

export function useTag(tagId: Tag['id'])
{
	const swrKey = ['tag', tagId];
	const fetcher = () => TagServerActions.getTagById(tagId);

	const { data: tag, mutate } = useSWR(swrKey, fetcher, {
		revalidateOnMount: true,
	});

	if (!tag)
	{
		throw new Error('Tag not found. This hook must be used within a component wrapped by a <TagLayout> that provides the tag data via SWR fallback.');
	}

	const updateTag = useCallback(
		async function updateTag({ name }: UpdateTagParams)
		{
			await mutate(
				async () =>
				{
					return await TagServerActions.updateTag({ id: tagId, name });
				},
				{
					optimisticData: (currentData, displayedData) =>
					{
						const current = currentData ?? displayedData;

						if (!current)
						{
							return { id: tagId, name: name ?? '', inventoryId: '' };
						}

						return { ...current, name: name ?? current.name };
					},
					rollbackOnError: true,
					revalidate: true,
				},
			);
		},
		[tagId, mutate],
	);

	return {
		tag: tag,
		updateTag,
	};
}
