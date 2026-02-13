import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { cookies } from 'next/headers';

interface Params
{
	'inventory-id': string;
}

interface InventoryLayoutProps
{
	params: Promise<Params>;
	children: React.ReactNode;
}

export default async function InventoryLayout({ children }: InventoryLayoutProps)
{
	const cookieStore = await cookies();
	const sidebarState = cookieStore.get('sidebar_state')?.value === 'true';

	return (
		<SidebarProvider defaultOpen={sidebarState}>
			<AppSidebar />
			<SidebarInset>{children}</SidebarInset>
		</SidebarProvider>
	);
}
