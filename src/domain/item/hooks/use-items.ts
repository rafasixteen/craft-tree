'use client';

import { Inventory, getInventoryItems } from '@/domain/inventory';
import { Item } from '@/domain/item';
import { Tag } from '@/domain/tag';
import { useCallback } from 'react';
import * as ItemServerActions from '@/domain/item/server';
import useSWR from 'swr';

interface CreateItemParams
{
	name: Item['name'];
	icon: Item['icon'];
	tagIds?: Tag['id'][];
}

interface UpdateItemParams
{
	itemId: Item['id'];
	name?: Item['name'];
	icon?: Item['icon'];
	tagIds?: Tag['id'][];
}

interface DeleteItemParams
{
	itemId: Item['id'];
}

export function useItems(inventoryId: Inventory['id'])
{
	const swrKey = ['inventory-items', inventoryId];
	const fetcher = () => getInventoryItems(inventoryId);

	const { data, mutate } = useSWR(swrKey, fetcher, {
		revalidateOnMount: true,
	});

	const createItem = useCallback(
		async function createItem({ name, icon, tagIds }: CreateItemParams)
		{
			const optimistic: Item = {
				id: crypto.randomUUID(),
				name,
				icon,
				inventoryId,
			};

			await mutate(
				async (current = []) =>
				{
					const created = await ItemServerActions.createItem({ name, icon, inventoryId });

					if (tagIds && tagIds.length > 0)
					{
						await ItemServerActions.setItemTags({ itemId: created.id, tagIds: tagIds });
					}

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
		async function updateItem({ itemId, name, icon, tagIds }: UpdateItemParams)
		{
			await mutate(
				async (current = []) =>
				{
					const updated = await ItemServerActions.updateItem({ itemId, name, icon });

					if (tagIds && tagIds.length > 0)
					{
						await ItemServerActions.setItemTags({ itemId, tagIds });
					}

					return current.map((item) => (item.id === itemId ? { ...item, ...updated, ...(tagIds ? { tagIds } : {}) } : item));
				},
				{
					optimisticData: (current: Item[] = []) =>
						current.map((item) => (item.id === itemId ? { ...item, ...(name ? { name } : {}), ...(icon ? { icon } : {}), ...(tagIds ? { tagIds } : {}) } : item)),
					rollbackOnError: true,
					revalidate: true,
				},
			);
		},
		[inventoryId, mutate],
	);

	const deleteItem = useCallback(
		async function deleteItem({ itemId }: DeleteItemParams)
		{
			await mutate(
				async (current = []) =>
				{
					await ItemServerActions.deleteItem({ itemId });
					return current.filter((item) => item.id !== itemId);
				},
				{
					optimisticData: (current: Item[] = []) => current.filter((item) => item.id !== itemId),
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
