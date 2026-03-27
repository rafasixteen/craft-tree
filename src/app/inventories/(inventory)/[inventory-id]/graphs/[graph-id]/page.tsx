import { Header } from '@/components/sidebar';
import { GraphFlow } from '@/components/graph/flow';

import { getGraphById } from '@/domain/graph';

import { cookies } from 'next/headers';
import { ReactFlowProvider } from '@xyflow/react';
import { GraphFlowV2 } from '@/components/graph-v2';

export default async function GraphPage({ params }: PageProps<'/inventories/[inventory-id]/graphs/[graph-id]'>)
{
	const cookieStore = await cookies();
	const themeCookie = cookieStore.get('theme')?.value;

	const initialTheme = themeCookie === 'dark' || themeCookie === 'light' ? themeCookie : 'light';

	const { 'graph-id': graphId } = await params;
	const graph = await getGraphById({ graphId });

	const { nodes, edges, viewport } = graph.data;

	return (
		<>
			<Header />
			<ReactFlowProvider>
				<GraphFlowV2
					initialTheme={initialTheme}
					initialNodes={nodes}
					initialEdges={edges}
					initialViewport={viewport}
				/>
			</ReactFlowProvider>
		</>
	);
}
