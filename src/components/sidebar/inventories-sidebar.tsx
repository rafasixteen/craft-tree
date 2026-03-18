import { AppSidebar, NavGroup } from '@/components/sidebar';

import { PackageIcon } from 'lucide-react';

export function InventoriesSidebar(props: React.ComponentProps<typeof AppSidebar>)
{
	return (
		<AppSidebar {...props}>
			<NavGroup
				label="General"
				items={[
					{
						label: 'Inventories',
						href: '/inventories',
						icon: PackageIcon,
					},
				]}
			/>
		</AppSidebar>
	);
}
