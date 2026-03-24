import { getInventoriesByUserId } from '@/domain/inventory';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

import { SWRConfig, unstable_serialize } from 'swr';

export default async function InventoriesRootLayout({ children }: LayoutProps<'/inventories'>)
{
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user)
	{
		return redirect('/sign-in');
	}

	return (
		<SWRConfig
			value={{
				fallback: {
					[unstable_serialize(['inventories', user.id])]: getInventoriesByUserId({ userId: user.id }),
				},
			}}
		>
			{children}
		</SWRConfig>
	);
}
