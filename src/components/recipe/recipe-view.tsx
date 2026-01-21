import { Recipe } from '@/domain/recipe';

interface RecipeViewProps
{
	recipe: Recipe;
}

export function RecipeView({ recipe }: RecipeViewProps)
{
	return (
		<div>
			<h2>{recipe.name}</h2>
			<p>Quantity: {recipe.quantity}</p>
			<p>Time: {recipe.time}</p>
		</div>
	);
}
