import { Recipe, getRecipeIngredients } from '@/domain/recipe';
import useSWR from 'swr';

export function useRecipeIngredients(recipeId: Recipe['id'])
{
	const { data: ingredients, error, isLoading, isValidating, mutate } = useSWR(`recipe-ingredients-${recipeId}`, () => getRecipeIngredients(recipeId));

	return {
		ingredients,
		error,
		isLoading,
		isValidating,
		mutate,
	};
}
