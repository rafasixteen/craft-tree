'use client';

import useSWR, { SWRResponse } from 'swr';
import { Ingredient } from '@/domain/ingredient';
import { getRecipeIngredients } from '@/domain/recipe/services';

export function useRecipeIngredients(recipeId?: string): SWRResponse<Ingredient[]>
{
	return useSWR(recipeId ? ['recipe-ingredients', recipeId] : null, () => getRecipeIngredients(recipeId!));
}
