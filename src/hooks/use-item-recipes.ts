'use client';

import useSWR, { SWRResponse } from 'swr';
import { Recipe } from '@/domain/recipe';
import { getRecipes } from '@/domain/item/services';

export function useItemRecipes(itemId: string): SWRResponse<Recipe[]>
{
	return useSWR(['item-recipes', itemId], () => getRecipes(itemId));
}
