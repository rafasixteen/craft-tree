import { useState, useEffect, useMemo, useCallback } from 'react';
import { Ingredient } from '@/domain/ingredient';
import { Recipe } from '@/domain/recipe';

export function useRecipeDraft(recipe: Recipe | undefined, ingredients: Ingredient[] | undefined)
{
	const [draftRecipe, setDraftRecipe] = useState<Recipe | null>(null);
	const [draftIngredients, setDraftIngredients] = useState<Ingredient[]>([]);

	useEffect(() =>
	{
		if (recipe) setDraftRecipe({ ...recipe });
		if (ingredients) setDraftIngredients(ingredients.map((ing) => ({ ...ing })));
	}, [recipe, ingredients]);

	function isRecipeValid(recipe: Recipe | null)
	{
		return !!recipe && !!recipe.name && recipe.quantity > 0 && recipe.time >= 0;
	}

	function areIngredientsValid(ingredients: Ingredient[])
	{
		return ingredients.every((ing) => ing.quantity > 0 && !!ing.itemId);
	}

	const isValid = useMemo(
		function isValid()
		{
			return isRecipeValid(draftRecipe) && areIngredientsValid(draftIngredients);
		},
		[draftRecipe, draftIngredients],
	);

	const reset = useCallback(
		function reset()
		{
			if (recipe) setDraftRecipe({ ...recipe });
			if (ingredients) setDraftIngredients(ingredients.map((ing) => ({ ...ing })));
		},
		[recipe, ingredients],
	);

	return {
		draftRecipe,
		setDraftRecipe,
		draftIngredients,
		setDraftIngredients,
		isValid,
		reset,
	};
}
