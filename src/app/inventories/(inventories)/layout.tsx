import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { findUserIdByEmail } from '@/domain/user';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { InventoriesSidebar } from '@/components/craft-tree-sidebar';
import { cookies } from 'next/headers';

export default async function InventoriesLayout({ children }: LayoutProps<'/inventories'>)
{
	const session = await auth();

	if (!session)
	{
		return redirect('/sign-in');
	}

	const email = session.user?.email;

	if (!email)
	{
		redirect('/sign-in');
	}

	const userId = await findUserIdByEmail(email);

	if (!userId)
	{
		return redirect('/sign-in');
	}

	const cookieStore = await cookies();
	const sidebarState = cookieStore.get('sidebar_state')?.value !== 'false';

	return (
		<SidebarProvider defaultOpen={sidebarState}>
			<InventoriesSidebar />
			<SidebarInset>{children}</SidebarInset>
		</SidebarProvider>
	);
}
