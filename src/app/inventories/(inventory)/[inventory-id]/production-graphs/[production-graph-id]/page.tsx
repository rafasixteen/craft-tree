import { cookies } from 'next/headers';
import { Header } from '@/components/sidebar';
import { ProductionGraph } from '@/components/production-graph/flow';
import { ReactFlowProvider } from '@xyflow/react';
import { getProductionGraphById } from '@/domain/production-graph';

export default async function ProductionGraphPage({ params }: PageProps<'/inventories/[inventory-id]/production-graphs/[production-graph-id]'>)
{
	const cookieStore = await cookies();
	const themeCookie = cookieStore.get('theme')?.value;

	const initialTheme = themeCookie === 'dark' || themeCookie === 'light' ? themeCookie : 'light';

	const { 'production-graph-id': productionGraphId } = await params;
	const productionGraph = await getProductionGraphById(productionGraphId);

	const { nodes, edges, viewport } = productionGraph.data;

	return (
		<>
			<Header />
			<ReactFlowProvider>
				<ProductionGraph initialTheme={initialTheme} initialNodes={nodes} initialEdges={edges} initialViewport={viewport} />
			</ReactFlowProvider>
		</>
	);
}
