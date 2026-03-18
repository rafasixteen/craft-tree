'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useUser } from '@/domain/user';

import { signOut } from '@/lib/auth';

import Link from 'next/link';
import { ChevronsUpDown, LogOut, Settings, User } from 'lucide-react';

export function NavUser()
{
	const user = useUser();

	if (!user)
	{
		return (
			<SidebarMenu>
				<SidebarMenuItem>
					<div className="flex items-center gap-2 px-2 py-1.5">
						<Skeleton className="size-8 shrink-0 rounded-lg" />
						<div className="flex flex-1 flex-col gap-1.5">
							<Skeleton className="h-2.5 w-20 rounded-sm" />
							<Skeleton className="h-2 w-28 rounded-sm" />
						</div>
						<Skeleton className="ml-auto size-4 shrink-0 rounded-sm" />
					</div>
				</SidebarMenuItem>
			</SidebarMenu>
		);
	}

	const name = user.user_metadata.name;
	const email = user.email;
	const avatar =
		user.user_metadata.avatar_url ??
		`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
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
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side="top"
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="size-8 rounded-lg">
									<AvatarImage src={avatar} alt={name} />
									<AvatarFallback className="rounded-lg">
										{name.slice(0, 2).toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm/tight">
									<span className="truncate font-medium">{name}</span>
									<span className="truncate text-xs">{email}</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem asChild>
								<Link href="/settings" className="flex items-center gap-2">
									<Settings />
									Settings
								</Link>
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<form action={signOut}>
								<button type="submit" className="flex w-full items-center gap-2">
									<LogOut />
									Sign Out
								</button>
							</form>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
