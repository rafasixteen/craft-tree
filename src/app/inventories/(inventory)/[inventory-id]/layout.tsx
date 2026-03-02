import { InventorySidebar } from '@/components/craft-tree-sidebar/inventory-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { getItems } from '@/domain/item';
import { getItemsTags, getProducersTags, getTags } from '@/domain/tag';
import { getProducers, getProducersInputs, getProducersOutputs } from '@/domain/producer';
import { cookies } from 'next/headers';
import { SWRConfig, unstable_serialize } from 'swr';
import { getInventoryById } from '@/domain/inventory';
import { getProductionGraphs } from '@/domain/production-graph';

export default async function InventoryLayout({ params, children }: LayoutProps<'/inventories/[inventory-id]'>)
{
	const { 'inventory-id': inventoryId } = await params;

	const cookieStore = await cookies();
	const sidebarState = cookieStore.get('sidebar_state')?.value !== 'false';

	return (
		<SWRConfig
			value={{
				fallback: {
					[unstable_serialize(['inventory', inventoryId])]: getInventoryById(inventoryId),
					[unstable_serialize(['inventory-tags', inventoryId])]: getTags({ inventoryId }),
					[unstable_serialize(['inventory-items', inventoryId])]: getItems({ inventoryId }),
					[unstable_serialize(['inventory-items-tags', inventoryId])]: getItemsTags({ inventoryId }),
					[unstable_serialize(['inventory-producers', inventoryId])]: getProducers({ inventoryId }),
					[unstable_serialize(['inventory-producers-inputs', inventoryId])]: getProducersInputs({ inventoryId }),
					[unstable_serialize(['inventory-producers-outputs', inventoryId])]: getProducersOutputs({ inventoryId }),
					[unstable_serialize(['inventory-producers-tags', inventoryId])]: getProducersTags({ inventoryId }),
					[unstable_serialize(['inventory-production-graphs', inventoryId])]: getProductionGraphs({ inventoryId }),
				},
			}}
		>
			<SidebarProvider defaultOpen={sidebarState}>
				<InventorySidebar inventoryId={inventoryId} />
				<SidebarInset>{children}</SidebarInset>
			</SidebarProvider>
		</SWRConfig>
	);
}
