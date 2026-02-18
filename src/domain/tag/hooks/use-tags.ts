'use client';

import { getTags, Tag } from '@/domain/tag';
import { useCallback } from 'react';
import { Inventory } from '@/domain/inventory';
import * as TagServerActions from '@/domain/tag/server';
import useSWR from 'swr';

type CreateTagParams = Omit<Parameters<typeof TagServerActions.createTag>[0], 'inventoryId'>;

type UpdateTagParams = Parameters<typeof TagServerActions.updateTag>[0];

type DeleteTagParams = Parameters<typeof TagServerActions.deleteTag>[0];

export function useTags(inventoryId: Inventory['id'])
{
	const swrKey = ['tags', inventoryId];
	const fetcher = () => getTags({ inventoryId });

	const { data, mutate } = useSWR(swrKey, fetcher, {
		revalidateOnMount: true,
	});

	const createTag = useCallback(
		async function createTag({ name }: CreateTagParams)
		{
			const optimistic: Tag = {
				id: crypto.randomUUID(),
				name,
				inventoryId,
			};

			await mutate(
				async (current: Tag[] = []) =>
				{
					const created = await TagServerActions.createTag({ name, inventoryId });
					return [...current, created];
				},
				{
					optimisticData: (current: Tag[] = []) => [...current, optimistic],
					rollbackOnError: true,
					revalidate: true,
				},
			);
		},
		[inventoryId, mutate],
	);

	const updateTag = useCallback(
		async function updateTag({ id, name }: UpdateTagParams)
		{
			await mutate(
				async (current: Tag[] = []) =>
				{
					const updated = await TagServerActions.updateTag({ id, name });
					return current.map((tag) => (tag.id === id ? { ...tag, ...updated } : tag));
				},
				{
					optimisticData: (current: Tag[] = []) => current.map((tag) => (tag.id === id ? { ...tag, name } : tag)),
					rollbackOnError: true,
					revalidate: true,
				},
			);
		},
		[mutate],
	);

	const deleteTag = useCallback(
		async function deleteTag(id: DeleteTagParams)
		{
			await mutate(
				async (current: Tag[] = []) =>
				{
					await TagServerActions.deleteTag(id);
					return current.filter((tag) => tag.id !== id);
				},
				{
					optimisticData: (current: Tag[] = []) => current.filter((tag) => tag.id !== id),
					rollbackOnError: true,
					revalidate: true,
				},
			);
		},
		[mutate],
	);

	return {
		tags: data ?? [],
		createTag,
		updateTag,
		deleteTag,
	};
}
