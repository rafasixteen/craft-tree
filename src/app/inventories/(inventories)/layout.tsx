import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { InventoriesSidebar } from '@/components/craft-tree-sidebar';
import { cookies } from 'next/headers';

export default async function InventoriesLayout({ children }: LayoutProps<'/inventories'>)
{
	const cookieStore = await cookies();
	const sidebarState = cookieStore.get('sidebar_state')?.value !== 'false';

	return (
		<SidebarProvider defaultOpen={sidebarState}>
			<InventoriesSidebar />
			<SidebarInset>{children}</SidebarInset>
		</SidebarProvider>
	);
}
