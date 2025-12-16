import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { getItemBySlug } from '@/domain/item';
import { getAscendentNodes } from '@/domain/node';
import { Node } from '@generated/graphql/types';
import prisma from '@/lib/prisma';
import React from 'react';

interface LayoutProps
{
	children: React.ReactNode;
	params: Promise<{ slug: string }>;
}

export default async function Layout({ children, params }: LayoutProps)
{
	const { slug } = await params;

	const item = await getItemBySlug(slug);

	if (!item)
	{
		return <div>Item not found</div>;
	}

	const node = await prisma.node.findFirstOrThrow({
		where: {
			item: item,
		},
	});

	const ascendantNodes = await getAscendentNodes(node.id);

	return (
		<>
			<div className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
				<Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
				<Breadcrumbs nodes={ascendantNodes} />
			</div>
			<div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
		</>
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
