import { getProductionGraphById } from '@/domain/production-graph';
import { SWRConfig, unstable_serialize } from 'swr';

export default async function ProductionGraphLayout({
	params,
	children,
}: LayoutProps<'/inventories/[inventory-id]/production-graphs/[production-graph-id]'>)
{
	const { 'production-graph-id': productionGraphId } = await params;

	return (
		<SWRConfig
			value={{
				fallback: {
					[unstable_serialize([
						'production-graph',
						productionGraphId,
					])]: getProductionGraphById(productionGraphId),
				},
			}}
		>
			{children}
		</SWRConfig>
	);
}
