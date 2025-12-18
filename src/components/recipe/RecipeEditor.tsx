'use client';

import { Recipe } from '@domain/recipe';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@components/ui/input';
import { useState, useEffect, useRef } from 'react';
import { Ingredients } from '@components/recipe';
import { Ingredient } from '@/domain/recipe';
import { cn } from '@/lib/utils';
import { updateRecipe } from '@/lib/graphql/recipes';
import { IngredientInput } from '@generated/graphql/types';

interface RecipeEditorProps extends React.HTMLAttributes<HTMLDivElement>
{
	recipe: Recipe;
}

export function RecipeEditor({ recipe, className, ...props }: RecipeEditorProps)
{
	const [quantity, setQuantity] = useState<number>(recipe.quantity);
	const [time, setTime] = useState<number>(recipe.time);
	const [ingredients, setIngredients] = useState<Ingredient[]>(recipe.ingredients);

	const isFirstRender = useRef(true);

	function onQuantityChanged(event: React.ChangeEvent<HTMLInputElement>)
	{
		const newQuantity = parseInt(event.target.value, 10);
		setQuantity(newQuantity);
	}

	function onTimeChanged(event: React.ChangeEvent<HTMLInputElement>)
	{
		const newTime = parseInt(event.target.value, 10);
		setTime(newTime);
	}

	async function onIngredientsChanged(ingredients: Ingredient[])
	{
		const ingredientInputs: IngredientInput[] = ingredients.map((ingredient) => ({
			itemId: ingredient.item.id,
			quantity: ingredient.quantity,
		}));

		const updatedRecipe = await updateRecipe(
			recipe.id,
			{
				ingredients: ingredientInputs,
			},
			{
				name: true,
				ingredients: {
					item: {
						id: true,
						name: true,
					},
				},
			},
		);

		setIngredients(updatedRecipe.ingredients);
	}

	useEffect(() =>
	{
		if (isFirstRender.current)
		{
			isFirstRender.current = false;
			return;
		}

		const handler = setTimeout(() =>
		{
			updateRecipe(recipe.id, { quantity, time }, { id: true });
		}, 500);

		return () => clearTimeout(handler);
	}, [quantity, time, recipe.id]);

	return (
		<div className={cn('flex flex-col h-full min-h-0', className)} {...props}>
			<FieldSet className="flex flex-col flex-1 min-h-0">
				<FieldGroup className="flex flex-row gap-4 mb-2 shrink-0">
					<Field>
						<FieldLabel htmlFor="quantity">Quantity</FieldLabel>
						<Input id="quantity" type="number" min={0} value={quantity} onChange={onQuantityChanged} />
					</Field>
					<Field>
						<FieldLabel htmlFor="time">Time</FieldLabel>
						<Input id="time" type="number" min={0} value={time} onChange={onTimeChanged} />
					</Field>
				</FieldGroup>
				<FieldLabel htmlFor="ingredients">Ingredients</FieldLabel>
				<div className="flex-1 min-h-0">
					<Ingredients className="border rounded-md" initialIngredients={ingredients} onIngredientsChanged={onIngredientsChanged} />
				</div>
			</FieldSet>
		</div>
	);
}
