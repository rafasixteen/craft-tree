'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useRecipe, useRecipeIngredients } from '@/domain/recipe';
import { useRecipeDraft, RecipeEdit, RecipeInfo } from '@/components/recipe';
import { Recipe, updateRecipe } from '@/domain/recipe';
import { Skeleton } from '../ui/skeleton';

type RecipeViewTab = 'info' | 'edit';

interface RecipeViewV2Props
{
	recipeId: Recipe['id'];
}

export function RecipeViewV2({ recipeId }: RecipeViewV2Props)
{
	const { recipe, error: recipeError, isLoading: recipeLoading, isValidating: recipeValidating, mutate: mutateRecipe } = useRecipe(recipeId);
	const { ingredients, error: ingredientsError, isLoading: ingredientsLoading, isValidating: ingredientsValidating, mutate: mutateIngredients } = useRecipeIngredients(recipeId);
	const { draftRecipe, setDraftRecipe, draftIngredients, setDraftIngredients, isValid, reset: resetDraft } = useRecipeDraft(recipe, ingredients);

	const isLoading = recipeLoading || ingredientsLoading;
	const isValidating = recipeValidating || ingredientsValidating;
	const error = recipeError || ingredientsError;

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
			if (!recipe || !ingredients) return;

			// Keep previous values for rollback
			const previousRecipe = recipe;
			const previousIngredients = ingredients;

			// Optimistic update
			mutateRecipe(
				{
					...recipe,
					name: draftRecipe.name,
					quantity: draftRecipe.quantity,
					time: draftRecipe.time,
				},
				{ revalidate: false },
			);

			mutateIngredients(draftIngredients, { revalidate: false });

			try
			{
				// Server update (single call)
				await updateRecipe({
					id: draftRecipe.id,
					data: {
						name: draftRecipe.name,
						quantity: draftRecipe.quantity,
						time: draftRecipe.time,
						ingredients: draftIngredients,
					},
				});

				// Revalidate both caches
				mutateRecipe();
				mutateIngredients();

				setTab('info');
			}
			catch (error: unknown)
			{
				// Rollback on failure
				mutateRecipe(previousRecipe, { revalidate: false });
				mutateIngredients(previousIngredients, { revalidate: false });
			}
		},
		[isValid, draftRecipe, draftIngredients, recipe, ingredients, mutateRecipe, mutateIngredients, setTab],
	);

	function renderContent()
	{
		if (error)
		{
			return (
				<div className="flex flex-1 items-center justify-center p-8 text-center text-destructive">
					<span>
						Failed to load recipe or ingredients.
						<br />
						{String(error)}
					</span>
				</div>
			);
		}

		if (isLoading)
		{
			return <RecipeViewSkeleton />;
		}

		return (
			<Tabs value={tab} className="flex min-h-0 flex-1 flex-col overflow-hidden">
				<TabsContent value="info" className="flex-1">
					<RecipeInfo recipe={recipe!} ingredients={ingredients!} />
				</TabsContent>
				<TabsContent value="edit" className="min-h-0 flex-1 overflow-hidden">
					<RecipeEdit recipe={draftRecipe!} ingredients={draftIngredients} onRecipeChange={setDraftRecipe} onIngredientsChange={setDraftIngredients} />
				</TabsContent>
			</Tabs>
		);
	}

	return (
		<Card className="relative flex size-full min-h-0 flex-col bg-transparent ring-0">
			<CardContent className="flex min-h-0 flex-1 flex-col overflow-hidden">
				{renderContent()}
				{isValidating && !isLoading && !error && <ValidatingOverlay />}
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

function ValidatingOverlay()
{
	return (
		<div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-background/70">
			<div className="size-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
			<span className="sr-only">Validating...</span>
		</div>
	);
}

function RecipeViewSkeleton()
{
	return (
		<div className="flex flex-1 flex-col gap-6 p-4">
			<div className="flex flex-col gap-4">
				{/* Recipe name */}
				<Skeleton className="mb-2 h-8 w-1/2" />
				<div className="flex gap-4">
					{/* Quantity */}
					<Skeleton className="h-6 w-24" />

					{/* Time */}
					<Skeleton className="h-6 w-24" />
				</div>
				<div className="mt-4">
					{/* Ingredients title */}
					<Skeleton className="mb-2 h-6 w-32" />

					{/* Ingredients list */}
					<div className="flex flex-col gap-2">
						{[...Array(4)].map((_, i) => (
							<Skeleton key={i} className="h-5 w-full" />
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
