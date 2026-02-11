import { Ingredient } from '@/domain/ingredient';
import { Recipe } from '@/domain/recipe';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Field, FieldLabel } from '@/components/ui/field';
import { IngredientsTable } from '@/components/recipe';
import { useCallback } from 'react';

interface RecipeEditProps
{
	recipe: Recipe;
	ingredients: Ingredient[];
	onRecipeChange: (recipe: Recipe) => void;
	onIngredientsChange: (ingredients: Ingredient[]) => void;
}

export function RecipeEdit({ recipe, ingredients, onRecipeChange, onIngredientsChange }: RecipeEditProps)
{
	const onRecipeNameChange = useCallback(
		function onRecipeNameChange(e: React.ChangeEvent<HTMLInputElement>)
		{
			onRecipeChange({ ...recipe, name: e.target.value });
		},
		[recipe, onRecipeChange],
	);

	const onRecipeQuantityChange = useCallback(
		function onRecipeQuantityChange(e: React.ChangeEvent<HTMLInputElement>)
		{
			onRecipeChange({ ...recipe, quantity: Number(e.target.value) });
		},
		[recipe, onRecipeChange],
	);

	const onRecipeTimeChange = useCallback(
		function onRecipeTimeChange(e: React.ChangeEvent<HTMLInputElement>)
		{
			onRecipeChange({ ...recipe, time: Number(e.target.value) });
		},
		[recipe, onRecipeChange],
	);

	return (
		<div className="flex h-full min-h-0 flex-col">
			<div className="flex flex-1 flex-col overflow-hidden">
				<div className="grid grid-cols-3 gap-3">
					<Field orientation="responsive">
						<FieldLabel htmlFor="recipe-name">Name</FieldLabel>
						<Input id="recipe-name" value={recipe.name} onChange={onRecipeNameChange} placeholder="Recipe name" />
					</Field>
					<Field>
						<FieldLabel htmlFor="recipe-quantity">Quantity</FieldLabel>
						<Input id="recipe-quantity" type="number" min={1} value={recipe.quantity} onChange={onRecipeQuantityChange} />
					</Field>
					<Field>
						<FieldLabel htmlFor="recipe-time">Time (s)</FieldLabel>
						<Input id="recipe-time" type="number" min={0} value={recipe.time} onChange={onRecipeTimeChange} />
					</Field>
				</div>

				<Separator className="my-4" />

				<IngredientsTable ingredients={ingredients} recipe={recipe} onIngredientsChange={onIngredientsChange} />
			</div>
		</div>
	);
}
