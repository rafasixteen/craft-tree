'use client';

import { Recipe, updateRecipe } from '@domain/recipe';
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet, FieldTitle } from '@/components/ui/field';
import { Input } from '@components/ui/input';
import { useState } from 'react';
import { Ingredients } from '@components/recipe';
import { Ingredient } from '@/domain/recipe';
import { cn } from '@/lib/utils';

interface RecipeEditorProps extends React.HTMLAttributes<HTMLDivElement>
{
	recipe: Recipe;
}

export function RecipeEditor({ recipe, className, ...props }: RecipeEditorProps)
{
	const [quantity, setQuantity] = useState<number>(recipe.quantity);
	const [time, setTime] = useState<number>(recipe.time);

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

	function setIngredients(ingredients: Ingredient[])
	{
		console.log(ingredients);
	}

	const ingredients: Ingredient[] = [
		...recipe.ingredients,
		{
			id: 'item-3',
			item: { id: 'item-3', name: 'Copper Ore' },
			quantity: 10,
		},
		{
			id: 'item-4',
			item: { id: 'item-4', name: 'Gold Nugget' },
			quantity: 2,
		},
		...Array.from({ length: 10 }, (_, i) => ({
			id: `test-${i + 1}`,
			item: { id: `test-${i + 1}`, name: `Test Item ${i + 1}` },
			quantity: Math.floor(Math.random() * 20) + 1,
		})),
	];

	return (
		<div className={cn('flex flex-col h-full min-h-0', className)} {...props}>
			<FieldSet className="flex flex-col flex-1">
				<FieldGroup className="flex gap-4 mb-2">
					<Field>
						<FieldLabel htmlFor="quantity">Quantity</FieldLabel>
						<Input id="quantity" type="number" min={0} value={quantity} onChange={onQuantityChanged} />
						<FieldDescription>How many items this recipe produces.</FieldDescription>
					</Field>
					<Field>
						<FieldLabel htmlFor="time">Time</FieldLabel>
						<Input id="time" type="number" min={0} value={time} onChange={onTimeChanged} />
						<FieldDescription>How long this recipe takes to complete.</FieldDescription>
					</Field>
				</FieldGroup>
				<FieldLabel htmlFor="time">Ingredients</FieldLabel>
				<div className="flex-1 min-h-0">
					<Ingredients className="border rounded-md h-full" initialIngredients={ingredients} onIngredientsChanged={setIngredients} />
				</div>
				<FieldDescription>What does this recipe require to be made.</FieldDescription>
			</FieldSet>
		</div>
	);
}
