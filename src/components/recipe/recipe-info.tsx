import { Ingredient } from '@/domain/ingredient';
import { Recipe } from '@/domain/recipe';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Field, FieldLabel } from '@/components/ui/field';
import { IngredientsTable } from './ingredients-table';

interface RecipeInfoProps
{
	recipe: Recipe;
	ingredients: Ingredient[];
}

export function RecipeInfo({ recipe, ingredients }: RecipeInfoProps)
{
	return (
		<div className="flex flex-col h-full">
			<div className="grid grid-cols-2 gap-3">
				<Field>
					<FieldLabel htmlFor="recipe-quantity">Quantity</FieldLabel>
					<Input id="recipe-quantity" value={recipe.quantity} readOnly className="border-0 bg-transparent! focus-visible:ring-0 focus-visible:ring-offset-0" />
				</Field>
				<Field>
					<FieldLabel htmlFor="recipe-time">Time (s)</FieldLabel>
					<Input id="recipe-time" value={recipe.time} readOnly className="border-0 bg-transparent! focus-visible:ring-0 focus-visible:ring-offset-0" />
				</Field>
			</div>

			<Separator className="my-4" />

			<IngredientsTable ingredients={ingredients} />
		</div>
	);
}
