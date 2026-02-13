'use client';

import { getTags, Tag } from '@/domain/tag';
import { useCallback } from 'react';
import { Inventory } from '@/domain/inventory';
import * as TagServerActions from '@/domain/tag/server';
import useSWR from 'swr';

export function useTags(inventoryId: Inventory['id'])
{
	const swrKey = ['tags', inventoryId];
	const fetcher = () => getTags({ inventoryId });

	const { data, mutate } = useSWR(swrKey, fetcher, {
		revalidateOnMount: false,
	});

	const createTag = useCallback(
		async function createTag(name: string)
		{
			const optimistic: Tag = {
				id: crypto.randomUUID(),
				name,
				inventoryId,
			};

			await mutate(
				async (current = []) =>
				{
					const created = await TagServerActions.createTag({ name, inventoryId });
					return [...current, created];
				},
				{
					optimisticData: (current: Tag[] = []) => [...current, optimistic],
					rollbackOnError: true,
					revalidate: false,
				},
			);
		},
		[inventoryId, mutate],
	);

	const deleteTag = useCallback(
		async function deleteTag(id: Tag['id'])
		{
			await mutate(
				async (current = []) =>
				{
					await TagServerActions.deleteTag({ tagId: id });
					return current.filter((inv) => inv.id !== id);
				},
				{
					optimisticData: (current: Tag[] = []) => current.filter((inv) => inv.id !== id),
					rollbackOnError: true,
					revalidate: false,
				},
			);
		},
		[mutate],
	);

	return {
		tags: data ?? [],
		createTag,
		deleteTag,
	};
}
