import React from 'react';

interface RecipePageProps extends React.HTMLAttributes<HTMLDivElement>
{
	params: Promise<{ slug: string }>;
}

export default async function RecipePage({ params }: RecipePageProps)
{
	const { slug } = await params;

	return <div>Recipe: {slug}</div>;

	// const recipe = await getRecipeBySlug(slug);

	// return <RecipeEditor recipe={recipe!} />;
}
