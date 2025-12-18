import { getItemBySlug } from '@/domain/item';
import React from 'react';

interface ItemPageProps extends React.HTMLAttributes<HTMLDivElement>
{
	params: Promise<{ slug: string }>;
}

export default async function ItemPage({ params, ...props }: ItemPageProps)
{
	const { slug } = await params;
	const item = await getItemBySlug(slug);

	return (
		<div className="flex flex-col h-full min-h-0 border">
			<div className="shrink-0 mb-2">Controls / Filters</div>

			<div className="flex-1 min-h-0">
				{/* Layer 1 */}
				<div className="flex flex-col h-full min-h-0">
					{/* Layer 2 */}
					<div className="flex flex-col h-full min-h-0">
						<div className="flex-1 min-h-0">
							<div className="h-full overflow-y-auto p-2 space-y-2 border">
								{Array.from({ length: 100 }).map((_, i) => (
									<div key={i} className="h-10 border flex items-center px-2">
										Item {i + 1}
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
