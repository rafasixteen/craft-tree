import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getInventoriesByUserId } from '@/domain/inventory';
import { findUserIdByEmail } from '@/domain/user';
import { SWRConfig, unstable_serialize } from 'swr';

export default async function InventoriesRootLayout({ children }: LayoutProps<'/inventories'>)
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

	return (
		<SWRConfig
			value={{
				fallback: {
					[unstable_serialize(['userId', email])]: findUserIdByEmail(email),
					[unstable_serialize(['inventories', userId])]: getInventoriesByUserId(userId),
				},
			}}
		>
			{children}
		</SWRConfig>
	);
}
