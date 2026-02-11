'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useRecipe, useRecipeIngredients } from '@/domain/recipe';
import { useRecipeDraft, RecipeEdit, RecipeInfo } from '@/components/recipe';
import { Recipe, updateRecipe } from '@/domain/recipe';

type RecipeViewTab = 'info' | 'edit';

interface RecipeViewV2Props
{
	recipeId: Recipe['id'];
}

export function RecipeViewV2({ recipeId }: RecipeViewV2Props)
{
	const router = useRouter();

	const { recipe, isLoading: recipeLoading, error: recipeError, mutate: mutateRecipe } = useRecipe(recipeId);
	const { ingredients, isLoading: ingredientsLoading, error: ingredientsError } = useRecipeIngredients(recipeId);
	const { draftRecipe, setDraftRecipe, draftIngredients, setDraftIngredients, isValid, reset: resetDraft } = useRecipeDraft(recipe, ingredients);

	const [tab, setTab] = useState<RecipeViewTab>('info');

	const reset = useCallback(
		function reset()
		{
			resetDraft();
			setTab('info');
		},
		[resetDraft, setTab],
	);

	const save = useCallback(
		async function save()
		{
			if (!isValid || !draftRecipe) return;

			await mutateRecipe(
				async () =>
				{
					// Perform the DB update
					await updateRecipe({
						id: draftRecipe.id,
						data: {
							name: draftRecipe.name,
							quantity: draftRecipe.quantity,
							time: draftRecipe.time,
							ingredients: draftIngredients,
						},
					});
					// Optionally, fetch and return the updated recipe here if you want to update SWR cache immediately
					// return await getRecipeById(draftRecipe.id);
				},
				{ revalidate: true },
			);

			router.refresh();
			setTab('info');
		},
		[isValid, draftRecipe, draftIngredients, router, setTab, mutateRecipe, updateRecipe],
	);

	if (recipeLoading || ingredientsLoading || !draftRecipe || !recipe || !ingredients)
	{
		return <div>Loading...</div>;
	}
	if (recipeError || ingredientsError)
	{
		return <div>Error loading recipe or ingredients.</div>;
	}

	return (
		<Card className="flex size-full min-h-0 flex-col bg-transparent ring-0">
			<CardContent className="flex min-h-0 flex-1 flex-col overflow-hidden">
				<Tabs value={tab} className="flex min-h-0 flex-1 flex-col overflow-hidden">
					<TabsContent value="info" className="flex-1">
						<RecipeInfo recipe={recipe} ingredients={ingredients} />
					</TabsContent>
					<TabsContent value="edit" className="min-h-0 flex-1 overflow-hidden">
						<RecipeEdit recipe={draftRecipe} ingredients={draftIngredients} onRecipeChange={setDraftRecipe} onIngredientsChange={setDraftIngredients} />
					</TabsContent>
				</Tabs>
			</CardContent>
			<CardFooter className="justify-end gap-2">
				<Footer tab={tab} setTab={setTab} reset={reset} save={save} isValid={isValid} />
			</CardFooter>
		</Card>
	);
}

interface FooterProps
{
	tab: RecipeViewTab;
	setTab: (tab: RecipeViewTab) => void;
	reset: () => void;
	save: () => void;
	isValid: boolean;
}

function Footer({ tab, setTab, reset, save, isValid }: FooterProps)
{
	if (tab === 'edit')
	{
		return (
			<>
				<Button variant="ghost" onClick={reset}>
					Cancel
				</Button>
				<Button onClick={save} disabled={!isValid}>
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
}
