import { AppSidebar, NavGroup } from '@/components/sidebar';

import { Inventory } from '@/domain/inventory';

import { FactoryIcon, PackageIcon, TagsIcon, WaypointsIcon } from 'lucide-react';

interface InventorySidebarProps extends React.ComponentProps<typeof AppSidebar>
{
	inventoryId: Inventory['id'];
}

export function InventorySidebar({ inventoryId, ...props }: InventorySidebarProps)
{
	const base = `/inventories/${inventoryId}`;

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
			<NavGroup
				label="Inventory"
				items={[
					{
						label: 'Items',
						href: `${base}/items`,
						icon: PackageIcon,
					},
					{
						label: 'Producers',
						href: `${base}/producers`,
						icon: FactoryIcon,
					},
					{ label: 'Tags', href: `${base}/tags`, icon: TagsIcon },
					{
						label: 'Graphs',
						href: `${base}/graphs`,
						icon: WaypointsIcon,
					},
				]}
			/>
		</AppSidebar>
	);
}
