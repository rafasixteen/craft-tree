import { getInventoriesByUserId } from '@/domain/inventory';
import { SWRConfig, unstable_serialize } from 'swr';
import { createClient } from '@/lib/supabase/server';

export default async function InventoriesRootLayout({ children }: LayoutProps<'/inventories'>)
{
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	return (
		<SWRConfig
			value={{
				fallback: {
					[unstable_serialize(['inventories', user?.id])]: getInventoriesByUserId(user?.id ?? ''),
				},
			}}
		>
			{children}
		</SWRConfig>
	);
}
