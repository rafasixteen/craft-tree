import React from 'react';

interface ItemPageProps extends React.HTMLAttributes<HTMLDivElement>
{
	params: Promise<{ 'item-slug': string }>;
}

export default async function ItemPage({ params }: ItemPageProps)
{
	const { 'item-slug': itemSlug } = await params;

	return <div>Item: {itemSlug}</div>;

	// const item = await getItemBySlug(slug);

	// return <RecipeTree />;
}
