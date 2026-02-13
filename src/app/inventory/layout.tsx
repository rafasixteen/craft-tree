import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getInventories } from '@/domain/inventory';
import { getUserId } from '@/domain/user';
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
	const userId = await getUserId({ email: email });

	if (!userId)
	{
		return redirect('/sign-in');
	}

	return (
		<SWRConfig
			value={{
				fallback: {
					[unstable_serialize(['userId', email])]: getUserId({ email: email }),
					[unstable_serialize(['inventories', userId])]: getInventories(userId),
				},
			}}
		>
			{children}
		</SWRConfig>
	);
}
