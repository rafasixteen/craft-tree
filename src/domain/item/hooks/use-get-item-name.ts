'use client';

import { useItems } from '@/domain/inventory';
import { Item } from '@/domain/item';
import { useCallback } from 'react';

type UseGetItemNameParams = Partial<Parameters<typeof useItems>[0]>;

export function useGetItemName({ inventoryId }: UseGetItemNameParams)
{
	const { items } = useItems({ inventoryId });

	const getItemName = useCallback(
		function getItemName(itemId: Item['id'])
		{
			if (!items)
			{
				return;
			}

			const item = items.find((item) => item.id === itemId);

			if (!item)
			{
				return;
			}

			return item.name;
		},
		[items],
	);

	return getItemName;
}
