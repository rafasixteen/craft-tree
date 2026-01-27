'use client';

import useSWR, { SWRResponse } from 'swr';
import { Item } from '@/domain/item';
import { getItemById } from '@/domain/item/services';

export function useItem(itemId: string): SWRResponse<Item>
{
	return useSWR(['item', itemId], () => getItemById(itemId));
}
