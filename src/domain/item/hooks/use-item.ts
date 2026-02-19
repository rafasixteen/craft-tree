'use client';

import { Item } from '@/domain/item';
import { useCallback } from 'react';
import * as ItemServerActions from '@/domain/item/server';
import useSWR from 'swr';

type UpdateItemParams = Omit<Parameters<typeof ItemServerActions.updateItem>[0], 'id'>;

export function useItem(itemId: Item['id'])
{
	const swrKey = ['item', itemId];
	const fetcher = () => ItemServerActions.getItemById(itemId);

	const { data: item, mutate } = useSWR(swrKey, fetcher, {
		revalidateOnMount: true,
	});

	if (!item)
	{
		throw new Error('Item not found. This hook must be used within a component wrapped by a <ItemLayout> that provides the item data via SWR fallback.');
	}

	const updateItem = useCallback(
		async function updateItem({ name, icon }: UpdateItemParams)
		{
			await mutate(
				async () =>
				{
					return await ItemServerActions.updateItem({ id: itemId, name, icon });
				},
				{
					optimisticData: (currentData, displayedData) =>
					{
						const current = currentData ?? displayedData;

						if (!current)
						{
							return { id: itemId, name: name ?? '', icon: icon ?? '', inventoryId: '' };
						}

						return { ...current, name: name ?? current.name, icon: icon ?? current.icon };
					},
					rollbackOnError: true,
					revalidate: true,
				},
			);
		},
		[itemId, mutate],
	);

	return {
		item: item,
		updateItem,
	};
}
