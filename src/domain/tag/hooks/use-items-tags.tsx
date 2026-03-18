'use client';

import { ItemTag } from '@/domain/item';
import { getItemsTags } from '@/domain/tag';

import useSWR from 'swr';

type UseItemsTagsParams = Parameters<typeof getItemsTags>[0];

export function useItemsTags({ inventoryId }: UseItemsTagsParams)
{
	const swrKey = ['inventory-items-tags', inventoryId];
	const fetcher = () => getItemsTags({ inventoryId });

	const { data } = useSWR<ItemTag[]>(swrKey, fetcher);
	return data ?? [];
}
