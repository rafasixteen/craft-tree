'use client';

import { useState } from 'react';
import { PlusIcon, FolderIcon, Ellipsis, ChevronDown } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ItemInstance } from '@headless-tree/core';

type FolderProps<T> = {
	item: ItemInstance<T>;
};

// TODO: I want the row of the item content be able to show in diffrent folders its recipes.
// TODO: Add context menu support for folders, items and recipes.

export function Folder<T>({ item, ...props }: FolderProps<T>)
{
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const level = item.getItemMeta().level;
	const isRoot = level === 0;
	const isFolder = item.isFolder();
	const indent = 20;
	const iconOffset = 11;

	const toggleOpen = () => (item.isExpanded() ? item.collapse() : item.expand());

	return (
		<div
			{...props}
			className={`relative flex justify-between items-center cursor-pointer group px-2 py-1 transition-colors 
        ${item.isSelected() ? 'bg-primary/10' : ''}
        ${isMenuOpen ? 'bg-muted/50' : ''} 
        hover:bg-muted/50`}
			style={{ paddingLeft: `${level * indent}px` }}
		>
			{Array.from({ length: level }).map((_, i) => (
				<div key={i} className="absolute top-0 bottom-0 w-px bg-primary/30" style={{ left: `${i * indent + iconOffset}px` }} />
			))}

			<div className="flex items-center gap-2">
				<ChevronDown
					className={`p-1 transition-transform ${item.isExpanded() ? 'rotate-0' : '-rotate-90'} ${isFolder ? 'visible' : 'invisible'}`}
					onClick={toggleOpen}
				/>
				{!isRoot && <FolderIcon className="p-1" />}
				<span className="select-none">{item.getItemName()}</span>
			</div>

			<div className={`flex items-center gap-1 transition-opacity ${isMenuOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
				{isFolder && <PlusIcon className="p-1 rounded hover:bg-primary/15 hover:border hover:border-border transition-all" />}

				<DropdownMenu onOpenChange={setIsMenuOpen}>
					<DropdownMenuTrigger asChild>
						<Ellipsis className="p-1 rounded hover:bg-primary/15 hover:border hover:border-border transition-all" />
					</DropdownMenuTrigger>
					<DropdownMenuContent side="right" align="start" className="w-48">
						<DropdownMenuGroup>
							<DropdownMenuItem onSelect={() => console.log('Rename')}>Rename</DropdownMenuItem>
							<DropdownMenuItem onSelect={() => console.log('Delete')}>Delete</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuSub>
							<DropdownMenuSubTrigger>More</DropdownMenuSubTrigger>
							<DropdownMenuSubContent>
								<DropdownMenuItem onSelect={() => console.log('Duplicate')}>Duplicate</DropdownMenuItem>
								<DropdownMenuItem onSelect={() => console.log('Move')}>Move</DropdownMenuItem>
							</DropdownMenuSubContent>
						</DropdownMenuSub>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
}
