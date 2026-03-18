'use client';

import { Item } from '@/domain/item';
import * as ItemServerActions from '@/domain/item/server';

import useSWR from 'swr';
import { useCallback } from 'react';

type UseItemsParams = Parameters<typeof ItemServerActions.getItems>[0];

type CreateItemParams = Omit<Parameters<typeof ItemServerActions.createItem>[0], 'inventoryId'>;

type UpdateItemParams = Parameters<typeof ItemServerActions.updateItem>[0];

type DeleteItemParams = Parameters<typeof ItemServerActions.deleteItem>[0];

export function useItems({ inventoryId, options }: UseItemsParams)
{
	const swrKey = options ? ['inventory-items', inventoryId, options] : ['inventory-items', inventoryId];
	const fetcher = () => ItemServerActions.getItems({ inventoryId, options });

	const { data, mutate } = useSWR(swrKey, fetcher, {
		revalidateOnMount: true,
	});

	const createItem = useCallback(
		async function createItem({ name }: CreateItemParams)
		{
			const optimistic: Item = {
				id: crypto.randomUUID(),
				name,
				inventoryId: inventoryId,
			};

			await mutate(
				async (current = []) =>
				{
					const created = await ItemServerActions.createItem({
						name,
						inventoryId,
					});
					return [...current, created];
				},
				{
					optimisticData: (current: Item[] = []) => [...current, optimistic],
					rollbackOnError: true,
					revalidate: true,
				},
			);
		},
		[inventoryId, mutate],
	);

	const updateItem = useCallback(
		async function updateItem({ id, name }: UpdateItemParams)
		{
			await mutate(
				async (current = []) =>
				{
					const updated = await ItemServerActions.updateItem({
						id,
						name,
					});
					return current.map((item) => (item.id === id ? { ...item, ...updated } : item));
				},
				{
					optimisticData: (current: Item[] = []) =>
						current.map((item) =>
							item.id === id
								? {
										...item,
										name: name ?? item.name,
									}
								: item,
						),
					rollbackOnError: true,
					revalidate: true,
				},
			);
		},
		[inventoryId, mutate],
	);

	const deleteItem = useCallback(
		async function deleteItem(id: DeleteItemParams)
		{
			await mutate(
				async (current = []) =>
				{
					await ItemServerActions.deleteItem(id);
					return current.filter((item) => item.id !== id);
				},
				{
					optimisticData: (current: Item[] = []) => current.filter((item) => item.id !== id),
					rollbackOnError: true,
					revalidate: true,
				},
			);
		},
		[inventoryId, mutate],
	);

	return {
		items: data ?? [],
		createItem,
		updateItem,
		deleteItem,
	};
}
