import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { InventoriesProvider, getInventories } from '@/domain/inventory';
import { getUserId } from '@/domain/user';

interface InventoryRootLayoutProps
{
	children: React.ReactNode;
}

export default async function InventoryRootLayout({ children }: InventoryRootLayoutProps)
{
	const session = await auth();

	if (!session)
	{
		return redirect('/sign-in');
	}

	const userId = await getUserId({ email: session.user!.email! });

	if (!userId)
	{
		return redirect('/sign-in');
	}

	const inventories = await getInventories(userId);

	return (
		<InventoriesProvider userId={userId} initialData={inventories}>
			{children}
		</InventoriesProvider>
	);
}
