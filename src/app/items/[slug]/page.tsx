import React from 'react';

interface ItemPageProps extends React.HTMLAttributes<HTMLDivElement>
{
	params: Promise<{ slug: string }>;
}

export default async function ItemPage({ params, ...props }: ItemPageProps)
{
	const { slug } = await params;

	return (
		<div className="grid auto-rows-min gap-4 md:grid-cols-3">
			<div className="bg-muted/50 aspect-video rounded-xl" />
			<div className="bg-muted/50 aspect-video rounded-xl" />
			<div className="bg-muted/50 aspect-video rounded-xl" />
		</div>
	);
}
