import React from 'react';

interface RecipePageProps extends React.HTMLAttributes<HTMLDivElement>
{
	params: Promise<{ 'recipe-slug': string }>;
}

export default async function RecipePage({ params }: RecipePageProps)
{
	const { 'recipe-slug': recipeSlug } = await params;

	return <div>Recipe: {recipeSlug}</div>;

	// const recipe = await getRecipeBySlug(slug);

	// return <RecipeEditor recipe={recipe!} />;
}
