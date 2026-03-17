import { Header, InventoriesSidebar } from '@/components/sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { cookies } from 'next/headers';

export default async function SettingsLayout({ children }: LayoutProps<'/settings'>)
{
	const cookieStore = await cookies();
	const sidebarState = cookieStore.get('sidebar_state')?.value !== 'false';

	return (
		<SidebarProvider defaultOpen={sidebarState}>
			<InventoriesSidebar />
			<SidebarInset>
				<Header />
				<div className="flex">
					<div className="w-64 border-r p-4">
						<ol>
							<li>General</li>
							<li>Account</li>
						</ol>
					</div>
					{children}
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
