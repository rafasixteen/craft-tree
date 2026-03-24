import { InventorySidebar } from '@/components/sidebar/inventory-sidebar';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

import { getInventoryById } from '@/domain/inventory';
import { getItemsTags, getProducersTags } from '@/domain/tag';
import {
	getProducers,
	getProducersInputs,
	getProducersOutputs,
	getTags,
	getGraphs,
	getItems,
} from '@/domain/inventory';

import { cookies } from 'next/headers';
import { SWRConfig, unstable_serialize } from 'swr';

export default async function InventoryLayout({ params, children }: LayoutProps<'/inventories/[inventory-id]'>)
{
	const { 'inventory-id': inventoryId } = await params;

	const cookieStore = await cookies();
	const sidebarState = cookieStore.get('sidebar_state')?.value !== 'false';

	return (
		<SWRConfig
			value={{
				fallback: {
					[unstable_serialize(['inventory', inventoryId])]: getInventoryById({ inventoryId }),
					[unstable_serialize(['tags', inventoryId])]: getTags({ inventoryId }),
					[unstable_serialize(['items', inventoryId])]: getItems({ inventoryId }),
					[unstable_serialize(['items-tags', inventoryId])]: getItemsTags({ inventoryId }),
					[unstable_serialize(['producers', inventoryId])]: getProducers({ inventoryId }),
					[unstable_serialize(['producers-inputs', inventoryId])]: getProducersInputs({ inventoryId }),
					[unstable_serialize(['producers-outputs', inventoryId])]: getProducersOutputs({ inventoryId }),
					[unstable_serialize(['producers-tags', inventoryId])]: getProducersTags({ inventoryId }),
					[unstable_serialize(['graphs', inventoryId])]: getGraphs({ inventoryId }),
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
