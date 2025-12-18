import { Path } from '@/components/node';
import { getRecipeBySlug } from '@domain/recipe';
import prisma from '@lib/prisma';
import React from 'react';

interface LayoutProps
{
	children: React.ReactNode;
	params: Promise<{ slug: string }>;
}

export default async function Layout({ children, params }: LayoutProps)
{
	const { slug } = await params;
	const recipe = await getRecipeBySlug(slug);

	if (!recipe) return <div>Recipe not found</div>;

	const node = await prisma.node.findFirstOrThrow({
		where: {
			recipeId: recipe.id,
		},
	});

	return (
		<div className="flex h-full flex-col min-h-0">
			<div className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
				<Path node={node} />
			</div>

			<div className="flex-1 min-h-0 p-4">{children}</div>
		</div>
	);
}
