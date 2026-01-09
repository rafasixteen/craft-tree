import React from 'react';

interface ItemPageProps extends React.HTMLAttributes<HTMLDivElement>
{
	params: Promise<{ slug: string }>;
}

export default async function ItemPage({ params }: ItemPageProps)
{
	const { slug } = await params;

	return <div>Item: {slug}</div>;

	// const item = await getItemBySlug(slug);

	// return <RecipeTree />;
}
