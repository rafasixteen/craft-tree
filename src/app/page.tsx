import { SidebarInset } from '@/components/ui/sidebar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';

export default function Home()
{
	return (
		<SidebarInset>
			<div className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
				<Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem className="hidden md:block">
							<BreadcrumbLink href="#">components</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator className="hidden md:block" />
						<BreadcrumbItem className="hidden md:block">
							<BreadcrumbLink href="#">ui</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator className="hidden md:block" />
						<BreadcrumbItem>
							<BreadcrumbPage>button.tsx</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
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
