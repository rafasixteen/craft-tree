import { ChevronRight, File, Folder } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import SearchForm from './SearchForm';
import { NavUser } from './NavUser';
import { CollectionSwitcher } from './CollectionSwitcher';
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarHeader,
	SidebarFooter,
} from '@/components/ui/sidebar';

const data = {
	changes: [
		{
			file: 'README.md',
			state: 'M',
		},
		{
			file: 'api/hello/route.ts',
			state: 'U',
		},
		{
			file: 'app/layout.tsx',
			state: 'M',
		},
	],
	tree: [
		['app', ['api', ['hello', ['route.ts']], 'page.tsx', 'layout.tsx', ['blog', ['page.tsx']]]],
		['components', ['ui', 'button.tsx', 'card.tsx'], 'header.tsx', 'footer.tsx'],
		['lib', ['util.ts']],
		['public', 'favicon.ico', 'vercel.svg'],
		'.eslintrc.json',
		'.gitignore',
		'next.config.js',
		'tailwind.config.js',
		'package.json',
		'README.md',
	],
};

export default function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>)
{
	return (
		<Sidebar {...props}>
			<SidebarHeader className="h-32 border-b flex justify-center">
				<CollectionSwitcher collections={[{ name: 'Craft Tree', logo: null, plan: 'Pro' }]} />
				<SearchForm />
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Items</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{data.tree.map((item, index) => (
								<Tree key={index} item={item} />
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter className="h-16 border-t">
				<NavUser user={{ name: 'John Doe', email: 'john.doe@example.com', avatar: '/path/to/avatar.jpg' }} />
			</SidebarFooter>
		</Sidebar>
	);
}

type TreeItem = string | TreeItem[];

function Tree({ item }: { item: TreeItem })
{
	const [name, ...items] = Array.isArray(item) ? item : [item];

	if (!items.length)
	{
		return (
			<SidebarMenuButton isActive={name === 'button.tsx'} className="data-[active=true]:bg-transparent">
				<File />
				{name}
			</SidebarMenuButton>
		);
	}

	return (
		<SidebarMenuItem>
			<Collapsible className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90" defaultOpen={name === 'components' || name === 'ui'}>
				<CollapsibleTrigger asChild>
					<SidebarMenuButton>
						<ChevronRight className="transition-transform" />
						<Folder />
						{name}
					</SidebarMenuButton>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<SidebarMenuSub>
						{items.map((subItem, index) => (
							<Tree key={index} item={subItem} />
						))}
					</SidebarMenuSub>
				</CollapsibleContent>
			</Collapsible>
		</SidebarMenuItem>
	);
}
