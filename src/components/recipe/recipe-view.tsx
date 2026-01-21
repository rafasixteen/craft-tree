import { Ingredient } from '@/domain/ingredient';
import { Recipe } from '@/domain/recipe';

interface RecipeViewProps
{
	recipe: Recipe;
	ingredients: Ingredient[];
}

export function RecipeView({ recipe, ingredients }: RecipeViewProps)
{
	return (
		<div>
			<h2>{recipe.name}</h2>
			<p>Quantity: {recipe.quantity}</p>
			<p>Time: {recipe.time}</p>
		</div>
	);
}
