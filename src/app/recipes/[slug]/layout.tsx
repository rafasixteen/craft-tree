import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { getAscendentNodes } from '@domain/node';
import { getRecipeBySlug } from '@domain/recipe';
import { Node } from '@domain/node';
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

	if (!recipe)
	{
		return <div>Recipe not found</div>;
	}

	const node = await prisma.node.findFirstOrThrow({
		where: {
			recipeId: recipe.id,
		},
	});

	const ascendantNodes = await getAscendentNodes(node.id);

	return (
		<div className="flex h-full flex-col min-h-0">
			<div className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
				<Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
				<Breadcrumbs nodes={ascendantNodes} />
			</div>

			<div className="flex-1 min-h-0 p-4">{children}</div>
		</div>
	);
}

interface BreadcrumbsProps
{
	nodes: Node[];
}

function Breadcrumbs({ nodes }: BreadcrumbsProps)
{
	return (
		<Breadcrumb>
			<BreadcrumbList>
				{nodes.map((node, index) =>
				{
					const isLast = index === nodes.length - 1;
					return (
						<React.Fragment key={node.id}>
							{index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
							<BreadcrumbItem className="hidden md:block">
								{isLast ? <BreadcrumbPage>{node.name}</BreadcrumbPage> : <BreadcrumbLink href="#">{node.name}</BreadcrumbLink>}
							</BreadcrumbItem>
						</React.Fragment>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
