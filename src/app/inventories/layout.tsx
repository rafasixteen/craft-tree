import { redirect } from 'next/navigation';
import { getInventoriesByUserId } from '@/domain/inventory';
import { SWRConfig, unstable_serialize } from 'swr';
import { createClient } from '@/lib/supabase/server';

export default async function InventoriesRootLayout({ children }: LayoutProps<'/inventories'>)
{
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user)
	{
		redirect('/sign-in');
	}

	const userId = user.id;

	return (
		<SWRConfig
			value={{
				fallback: {
					[unstable_serialize(['inventories', userId])]: getInventoriesByUserId(userId),
				},
			}}
		>
			{children}
		</SWRConfig>
	);
}
