'use client';

import useSWR, { SWRResponse } from 'swr';
import { Recipe } from '@/domain/recipe';
import { getRecipeByIndex } from '@/domain/item';

export function useItemRecipe(itemId: string, recipeIndex: number): SWRResponse<Recipe | null>
{
	return useSWR(['item-recipes', itemId, recipeIndex], () => getRecipeByIndex(itemId, recipeIndex));
}
