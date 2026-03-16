'use client';

import { ChevronsUpDown, LogOut, Settings, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/domain/user';
import { redirect } from 'next/navigation';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function NavUser()
{
	const user = useUser();

	const name = user?.user_metadata.name ?? 'Unknown User';
	const email = user?.email ?? '';
	const avatar = user?.user_metadata.avatar_url ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

	async function signOut()
	{
		const supabase = createClient();
		const { error } = await supabase.auth.signOut();

		if (error)
		{
			throw error;
		}
		else
		{
			redirect('/sign-in');
		}
	}

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
							<Avatar className="size-8 rounded-lg">
								<AvatarImage src={avatar} alt={name} />
								<AvatarFallback className="rounded-lg">{name.slice(0, 2).toUpperCase()}</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm/tight">
								<span className="truncate font-medium">{name}</span>
								<span className="truncate text-xs">{email}</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg" side="right" align="end" sideOffset={4}>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="size-8 rounded-lg">
									<AvatarImage src={avatar} alt={name} />
									<AvatarFallback className="rounded-lg">{name.slice(0, 2).toUpperCase()}</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm/tight">
									<span className="truncate font-medium">{name}</span>
									<span className="truncate text-xs">{email}</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem>
								<User />
								Profile
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuGroup>
							<DropdownMenuItem>
								<Settings />
								Settings
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem onSelect={() => signOut()}>
							<LogOut />
							Sign Out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
