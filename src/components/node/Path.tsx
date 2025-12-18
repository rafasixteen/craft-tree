'use server';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { getAscendentNodes, Node } from '@domain/node';
import React from 'react';

interface BreadcrumbsProps
{
	node: Node;
}

export async function Path({ node }: BreadcrumbsProps)
{
	const ascendentNodes = await getAscendentNodes(node.id);

	return (
		<Breadcrumb>
			<BreadcrumbList>
				{ascendentNodes.map((node, index) =>
				{
					const isLast = index === ascendentNodes.length - 1;

					return (
						<React.Fragment key={node.id}>
							{index > 0 && <BreadcrumbSeparator />}
							<BreadcrumbItem>{isLast ? <BreadcrumbPage>{node.name}</BreadcrumbPage> : <BreadcrumbLink href="#">{node.name}</BreadcrumbLink>}</BreadcrumbItem>
						</React.Fragment>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
