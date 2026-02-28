import { InventorySidebar } from '@/components/craft-tree-sidebar/inventory-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { getItems } from '@/domain/item';
import { getItemsTags, getProducersTags, getTags } from '@/domain/tag';
import { getProducers } from '@/domain/producer';
import { cookies } from 'next/headers';
import { SWRConfig, unstable_serialize } from 'swr';

export default async function InventoryLayout({ params, children }: LayoutProps<'/inventories/[inventory-id]'>)
{
	const { 'inventory-id': inventoryId } = await params;

	const cookieStore = await cookies();
	const sidebarState = cookieStore.get('sidebar_state')?.value === 'true';

	console.log('InventoryLayout: inventoryId =', inventoryId);

	return (
		<SWRConfig
			value={{
				fallback: {
					[unstable_serialize(['inventory-items', inventoryId, {}])]: getItems({ inventoryId }),
					[unstable_serialize(['inventory-producers', inventoryId, {}])]: getProducers({ inventoryId }),
					[unstable_serialize(['inventory-items-tags', inventoryId])]: getItemsTags({ inventoryId }),
					[unstable_serialize(['inventory-producers-tags', inventoryId])]: getProducersTags({ inventoryId }),
					[unstable_serialize(['tags', inventoryId])]: getTags({ inventoryId }),
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
