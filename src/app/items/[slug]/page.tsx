import { RecipeTree } from '@/components/item';
import { getItemBySlug } from '@/domain/item';
import React from 'react';

interface ItemPageProps extends React.HTMLAttributes<HTMLDivElement>
{
	params: Promise<{ slug: string }>;
}

export default async function ItemPage({ params }: ItemPageProps)
{
	const { slug } = await params;
	const item = await getItemBySlug(slug);

	return <RecipeTree />;
}
