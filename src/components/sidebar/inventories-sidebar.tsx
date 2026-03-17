import { PackageIcon } from 'lucide-react';
import { AppSidebar, NavGroup } from '@/components/sidebar';

export function InventoriesSidebar(props: React.ComponentProps<typeof AppSidebar>)
{
	return (
		<AppSidebar {...props}>
			<NavGroup label="General" items={[{ label: 'Inventories', href: '/inventories', icon: PackageIcon }]} />
		</AppSidebar>
	);
}
