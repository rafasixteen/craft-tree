import { AppSidebar } from '@/components/craft-tree-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { getItems } from '@/domain/item';
import { getInventoryProducers } from '@/domain/inventory';
import { getTags } from '@/domain/tag';
import { cookies } from 'next/headers';
import { SWRConfig, unstable_serialize } from 'swr';

interface Params
{
	'inventory-id': string;
}

interface InventoryLayoutProps
{
	params: Promise<Params>;
	children: React.ReactNode;
}

export default async function InventoryLayout({ params, children }: InventoryLayoutProps)
{
	const cookieStore = await cookies();
	const sidebarState = cookieStore.get('sidebar_state')?.value === 'true';

	const inventoryId = (await params)['inventory-id'];

	return (
		<SWRConfig
			value={{
				fallback: {
					[unstable_serialize(['inventory-items', inventoryId, {}])]: getItems({ inventoryId }),
					[unstable_serialize(['inventory-producers', inventoryId])]: getInventoryProducers(inventoryId),
					[unstable_serialize(['tags', inventoryId])]: getTags({ inventoryId }),
				},
			}}
		>
			<SidebarProvider defaultOpen={sidebarState}>
				<AppSidebar />
				<SidebarInset>{children}</SidebarInset>
			</SidebarProvider>
		</SWRConfig>
	);
}
