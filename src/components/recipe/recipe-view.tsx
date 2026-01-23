'use client';

import { useMemo, useState } from 'react';
import { Ingredient } from '@/domain/ingredient';
import { Recipe, updateRecipe } from '@/domain/recipe';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RecipeInfo } from './recipe-info';
import { RecipeEdit } from './recipe-edit';
import { useTreeNodes } from '@/providers';
import { useRouter } from 'next/navigation';

type RecipeViewTab = 'info' | 'edit';

interface RecipeViewProps
{
	recipe: Recipe;
	ingredients: Ingredient[];
}

export function RecipeView({ recipe, ingredients }: RecipeViewProps)
{
	const router = useRouter();
	const { refresh } = useTreeNodes();

	const [tab, setTab] = useState<RecipeViewTab>('info');
	const [draftRecipe, setDraftRecipe] = useState<Recipe>(() => ({ ...recipe }));
	const [draftIngredients, setDraftIngredients] = useState<Ingredient[]>(() => ingredients.map((ing) => ({ ...ing })));

	const isValid = useMemo(() =>
	{
		const recipeValid = !!draftRecipe.name && draftRecipe.quantity > 0 && draftRecipe.time >= 0;
		const ingredientsValid = draftIngredients.every((ing) => ing.quantity > 0 && !!ing.itemId);
		return recipeValid && ingredientsValid;
	}, [draftRecipe, draftIngredients]);

	const handleReset = () =>
	{
		setDraftRecipe({ ...recipe });
		setDraftIngredients(ingredients.map((ing) => ({ ...ing })));
		setTab('info');
	};

	const handleSave = async () =>
	{
		if (!isValid) return;

		await updateRecipe({
			id: draftRecipe.id,
			data: {
				name: draftRecipe.name,
				quantity: draftRecipe.quantity,
				time: draftRecipe.time,
				ingredients: draftIngredients,
			},
		});

		await refresh();
		router.refresh();

		setTab('info');
	};

	const displayFooter = () =>
	{
		if (tab === 'edit')
		{
			return (
				<>
					<Button variant="ghost" onClick={handleReset}>
						Cancel
					</Button>
					<Button onClick={handleSave} disabled={!isValid}>
						Save Changes
					</Button>
				</>
			);
		}
		else
		{
			return (
				<Button variant="outline" onClick={() => setTab('edit')}>
					Edit
				</Button>
			);
		}
	};

	return (
		<Card className="w-full h-full flex flex-col min-h-0 bg-transparent ring-0">
			<CardContent className="flex-1 flex flex-col overflow-hidden min-h-0 ">
				<Tabs value={tab} className="flex-1 flex flex-col overflow-hidden min-h-0">
					<TabsContent value="info" className="flex-1">
						<RecipeInfo recipe={recipe} ingredients={ingredients} />
					</TabsContent>

					<TabsContent value="edit" className="flex-1 overflow-hidden min-h-0">
						<RecipeEdit recipe={draftRecipe} ingredients={draftIngredients} onRecipeChange={setDraftRecipe} onIngredientsChange={setDraftIngredients} />
					</TabsContent>
				</Tabs>
			</CardContent>

			<CardFooter className="justify-end gap-2">{displayFooter()}</CardFooter>
		</Card>
	);
}
