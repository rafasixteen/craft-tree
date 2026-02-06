'use client';

import { useEffect, useRef, useMemo, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { InventoryTreeNode, useInventory } from '@/domain/inventory';
import { ItemInstance } from '@headless-tree/core';
import { FolderIcon, BoxIcon, CuboidIcon, FolderOpenIcon, CookingPotIcon, ChevronRightIcon, EllipsisVerticalIcon } from 'lucide-react';
import { CollectionDropdown, FolderDropdown, ItemDropdown, RecipeDropdown } from '@/components/inventory-tree';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const inventoryTreeNodeVariants = cva(['rounded-sm py-1.5 outline-hidden transition-colors hover:bg-accent/50 [&_svg]:pointer-events-none [&_svg]:shrink-0'], {
	variants: {
		focused: {
			true: 'z-20 focus-visible:ring-1 focus-visible:ring-ring/50',
		},

		selected: {
			true: 'bg-accent text-accent-foreground',
		},

		dragTarget: {
			true: 'bg-accent',
		},

		searchMatch: {
			true: 'bg-accent! text-accent-foreground!',
		},
	},

	compoundVariants: [
		{
			selected: true,
			searchMatch: true,
			className: 'bg-accent! text-accent-foreground!',
		},
	],

	defaultVariants: {
		focused: false,
		selected: false,
		dragTarget: false,
		searchMatch: false,
	},
});

const iconClassName = 'pointer-events-none size-4 text-muted-foreground';

interface InventoryTreeNodeProps
{
	item: ItemInstance<InventoryTreeNode>;
}

export function InventoryTreeNodeComp({ item }: InventoryTreeNodeProps)
{
	const { getNodePath } = useInventory();

	const style: React.CSSProperties = {
		paddingLeft: `${item.getItemMeta().level * 20}px`,
	};

	const handleLinkClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) =>
	{
		// Prevent link navigation when using modifier keys (shift/ctrl)
		// This allows the tree's multi-select behavior to work
		if (e.shiftKey || e.ctrlKey || e.metaKey)
		{
			e.preventDefault();
		}
	}, []);

	const href = useMemo(() =>
	{
		const node = item.getItemData();
		const path = getNodePath(node).join('/');
		return `/collections/${path}`;
	}, [item, getNodePath]);

	return (
		<div
			{...item.getProps()}
			style={style}
			className={inventoryTreeNodeVariants({
				focused: item.isFocused(),
				selected: item.isSelected(),
				dragTarget: item.isDragTarget(),
				searchMatch: item.isMatchingSearch(),
			})}
		>
			<Link href={href} onClick={handleLinkClick}>
				<div className="group flex items-center gap-3 px-1.5">
					{/* Toggle Button */}
					<Button {...item.getToggleProps()} variant="ghost" size="icon">
						<ChevronRightIcon className={cn(iconClassName, 'transition-transform', item.isExpanded() && 'rotate-90', !item.isFolder() && 'invisible')} />
					</Button>

					{/* Icon and Name */}
					<div className="flex items-center gap-2 truncate">
						<Icon item={item} />
						<Name item={item} />
					</div>

					{/* Dropdown */}
					{!item.isRenaming() && (
						<div className="ml-auto">
							<Dropdown item={item} />
						</div>
					)}
				</div>
			</Link>
		</div>
	);
}

interface IconProps
{
	item: ItemInstance<InventoryTreeNode>;
}

function Icon({ item }: IconProps)
{
	const node = item.getItemData();

	switch (node.type)
	{
		case 'collection':
		{
			return <BoxIcon className={iconClassName} />;
		}
		case 'folder':
		{
			return item.isExpanded() ? <FolderOpenIcon className={iconClassName} /> : <FolderIcon className={iconClassName} />;
		}
		case 'item':
		{
			return <CuboidIcon className={iconClassName} />;
		}
		case 'recipe':
		{
			return <CookingPotIcon className={iconClassName} />;
		}
		default:
			return <></>;
	}
}

interface NameProps
{
	item: ItemInstance<InventoryTreeNode>;
}

function Name({ item }: NameProps)
{
	const inputRef = useRef<HTMLInputElement | null>(null);
	const isRenaming = item.isRenaming();

	useEffect(() =>
	{
		if (isRenaming && inputRef.current)
		{
			inputRef.current.focus();
			inputRef.current.select();
		}
	}, [isRenaming]);

	return isRenaming ? <Input {...item.getRenameInputProps()} ref={inputRef} autoFocus /> : <p className="text-xs">{item.getItemName()}</p>;
}

interface DropdownProps
{
	item: ItemInstance<InventoryTreeNode>;
}

function Dropdown({ item }: DropdownProps)
{
	const dropdowns = {
		collection: CollectionDropdown,
		folder: FolderDropdown,
		item: ItemDropdown,
		recipe: RecipeDropdown,
	} as const;

	const node = item.getItemData();
	const DropdownContent = useMemo(() => dropdowns[node.type as keyof typeof dropdowns], [node.type]);

	if (DropdownContent)
	{
		return (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="icon" className="opacity-0 transition-opacity group-hover:opacity-100">
						<EllipsisVerticalIcon className="size-4 text-muted-foreground" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start" side="right">
					<DropdownContent item={item} />
				</DropdownMenuContent>
			</DropdownMenu>
		);
	}
}
