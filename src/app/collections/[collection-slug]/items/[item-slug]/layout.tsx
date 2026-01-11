import React from 'react';
import { BreadcrumbTrail } from '@/components/shared/breadcrumb-trail';

interface LayoutProps
{
	children: React.ReactNode;
	params: Promise<{ slug: string }>;
}

const path = [{ name: 'components' }, { name: 'ui' }, { name: 'button.tsx' }];

export default async function Layout({ children, params }: LayoutProps)
{
	const { slug } = await params;
	// const item = await getItemBySlug(slug);

	// if (!item) return <div>Item not found</div>;

	// const node = await prisma.node.findFirstOrThrow({
	// 	where: {
	// 		item: item,
	// 	},
	// });

	return (
		<div className="flex h-full flex-col min-h-0">
			<div className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
				<BreadcrumbTrail path={path} />
			</div>

			<div className="flex-1 min-h-0 p-4">{children}</div>
		</div>
	);
}
