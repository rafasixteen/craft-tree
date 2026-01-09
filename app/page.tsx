import { SidebarInset } from '@/components/ui/sidebar';
import { BreadcrumbTrail } from '@/components/breadcrumb-trail';

const path = [{ name: 'components' }, { name: 'ui' }, { name: 'button.tsx' }];

export default function Home()
{
	return (
		<SidebarInset>
			<div className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
				<BreadcrumbTrail path={path} />
			</div>
			<div className="flex flex-1 flex-col gap-4 p-4">
				<div className="grid auto-rows-min gap-4 md:grid-cols-3">
					<div className="bg-muted/50 aspect-video rounded-xl" />
					<div className="bg-muted/50 aspect-video rounded-xl" />
					<div className="bg-muted/50 aspect-video rounded-xl" />
				</div>
			</div>
		</SidebarInset>
	);
}
