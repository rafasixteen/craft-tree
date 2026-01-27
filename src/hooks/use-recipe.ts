'use client';

import useSWR, { SWRResponse } from 'swr';
import { Recipe } from '@/domain/recipe';
import { getRecipeById } from '@/domain/recipe/services';

export function useRecipe(recipeId: string): SWRResponse<Recipe>
{
	return useSWR(['recipe', recipeId], () => getRecipeById(recipeId));
}
