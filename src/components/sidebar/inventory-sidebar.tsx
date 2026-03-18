import {
	FactoryIcon,
	PackageIcon,
	TagsIcon,
	WaypointsIcon,
} from 'lucide-react';
import { Inventory } from '@/domain/inventory';
import { AppSidebar, NavGroup } from '@/components/sidebar';

interface InventorySidebarProps extends React.ComponentProps<
	typeof AppSidebar
>
{
	inventoryId: Inventory['id'];
}

export function InventorySidebar({
	inventoryId,
	...props
}: InventorySidebarProps)
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
						label: 'Production Graphs',
						href: `${base}/production-graphs`,
						icon: WaypointsIcon,
					},
				]}
			/>
		</AppSidebar>
	);
}
