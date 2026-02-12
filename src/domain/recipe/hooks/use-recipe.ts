import { Recipe, getRecipeById } from '@/domain/recipe';
import useSWR from 'swr';

export function useRecipe(recipeId: Recipe['id'])
{
	const { data: recipe, error, isLoading, isValidating, mutate } = useSWR(`recipe-${recipeId}`, () => getRecipeById(recipeId), { revalidateOnFocus: false });

	return {
		recipe,
		error,
		isLoading,
		isValidating,
		mutate,
	};
}
