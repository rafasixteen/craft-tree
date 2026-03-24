import { getGraphById } from '@/domain/graph';

import { SWRConfig, unstable_serialize } from 'swr';

export default async function GraphLayout({
	params,
	children,
}: LayoutProps<'/inventories/[inventory-id]/graphs/[graph-id]'>)
{
	const { 'graph-id': graphId } = await params;

	return (
		<SWRConfig
			value={{
				fallback: {
					[unstable_serialize(['graph', graphId])]: getGraphById({ graphId }),
				},
			}}
		>
			{children}
		</SWRConfig>
	);
}
