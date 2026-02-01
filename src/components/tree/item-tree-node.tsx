'use client';

import { ItemInstance } from '@headless-tree/core';
import { TreeItem, TreeItemLabel } from '@/components/ui/tree';
import { getNodePath, Node } from '@/domain/tree';
import { FolderIcon, FolderOpenIcon, EllipsisVerticalIcon, CuboidIcon, CookingPotIcon, BoxIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ButtonSpan } from '@/components/ui/button-span';
import { useEffect, useRef, useState, useMemo, memo, useCallback } from 'react';
import { useTreeNodes } from '@/providers';
import { FolderDropdown, ItemDropdown, RecipeDropdown, CollectionDropdown } from '@/components/tree/dropdowns';
import useIsMobile from '@/hooks/use-is-mobile';
import Link from 'next/link';

interface ItemTreeNodeProps
{
	item: ItemInstance<Node>;
	visible: boolean;
}

export function ItemTreeNode({ item, visible }: ItemTreeNodeProps)
{
	const { isMobile } = useIsMobile();
	const { nodes } = useTreeNodes();

	const [dropdownOpen, setDropdownOpen] = useState(false);
	const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

	const node = item.getItemData();
	const isRenaming = item.isRenaming();

	const path = useMemo(() => getNodePath(nodes, node.id), [nodes, node.id]);
	const href = isRenaming ? '#' : '/collections/' + path.join('/');

	const handlePressStart = useCallback(() =>
	{
		if (!isRenaming)
		{
			longPressTimerRef.current = setTimeout(() =>
			{
				setDropdownOpen(true);
			}, 500);
		}
	}, [isRenaming]);

	const handlePressEnd = useCallback(() =>
	{
		if (longPressTimerRef.current)
		{
			clearTimeout(longPressTimerRef.current);
			longPressTimerRef.current = null;
		}
	}, []);

	const handleLinkClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) =>
	{
		// Prevent link navigation when using modifier keys (shift/ctrl)
		// This allows the tree's multi-select behavior to work
		if (e.shiftKey || e.ctrlKey || e.metaKey)
		{
			e.preventDefault();
		}
	}, []);

	return (
		<TreeItem className="group data-[visible=false]:hidden" data-visible={visible} item={item} asChild>
			<Link href={href} onClick={handleLinkClick}>
				<TreeItemLabel onTouchStart={handlePressStart} onTouchEnd={handlePressEnd} onTouchCancel={handlePressEnd}>
					<div className="flex flex-1 items-center justify-between gap-2">
						<span className="flex items-center gap-2">
							<Icon item={item} />
							<Name item={item} />
						</span>
						{!isRenaming && <ActionsDropdown item={item} isMobile={isMobile} dropdownOpen={dropdownOpen} setDropdownOpen={setDropdownOpen} />}
					</div>
				</TreeItemLabel>
			</Link>
		</TreeItem>
	);
}

interface IconProps
{
	item: ItemInstance<Node>;
}

function Icon({ item }: IconProps)
{
	const className = 'pointer-events-none size-4 text-muted-foreground';

	const node = item.getItemData();

	switch (node.type)
	{
		case 'collection':
		{
			return <BoxIcon className={className} />;
		}
		case 'folder':
		{
			return item.isExpanded() ? <FolderOpenIcon className={className} /> : <FolderIcon className={className} />;
		}
		case 'item':
		{
			return <CuboidIcon className={className} />;
		}
		case 'recipe':
		{
			return <CookingPotIcon className={className} />;
		}
		default:
			return <></>;
	}
}

interface NameProps
{
	item: ItemInstance<Node>;
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

interface ActionsDropdownProps
{
	item: ItemInstance<Node>;
	isMobile: boolean;
	dropdownOpen: boolean;
	setDropdownOpen: (open: boolean) => void;
}

const ActionsDropdown = memo(function ActionsDropdown({ item, isMobile, dropdownOpen, setDropdownOpen }: ActionsDropdownProps)
{
	const dropdownComponentMap = {
		collection: CollectionDropdown,
		folder: FolderDropdown,
		item: ItemDropdown,
		recipe: RecipeDropdown,
	} as const;

	const node = item.getItemData();
	const DropdownContent = useMemo(() => dropdownComponentMap[node.type as keyof typeof dropdownComponentMap], [node.type]);

	if (DropdownContent)
	{
		return (
			<DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
				<DropdownMenuTrigger asChild>
					<ButtonSpan variant="ghost" size="icon" className="opacity-0 transition-opacity group-hover:opacity-100">
						<EllipsisVerticalIcon className="size-4" />
					</ButtonSpan>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start" side={isMobile ? 'left' : 'right'}>
					<DropdownContent item={item} />
				</DropdownMenuContent>
			</DropdownMenu>
		);
	}
	else
	{
		return null;
	}
});
