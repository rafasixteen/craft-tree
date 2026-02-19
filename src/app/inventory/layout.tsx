import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getInventoriesByUserId } from '@/domain/inventory';
import { getUserIdByEmail } from '@/domain/user';
import { SWRConfig, unstable_serialize } from 'swr';

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

	const email = session.user!.email!;
	const userId = await getUserIdByEmail(email);

	return (
		<SWRConfig
			value={{
				fallback: {
					[unstable_serialize(['userId', email])]: getUserIdByEmail(email),
					[unstable_serialize(['inventories', userId])]: getInventoriesByUserId(userId),
				},
			}}
		>
			{children}
		</SWRConfig>
	);
}
