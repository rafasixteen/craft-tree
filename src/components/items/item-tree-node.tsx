'use client';

import { cn } from '@/lib/utils';
import { ChevronRight, FolderOpen, Package, FileText } from 'lucide-react';
import { TreeNode, TreeNodeType } from './types';
import { ItemInstance } from '@headless-tree/core';

interface ItemTreeNodeProps
{
	item: ItemInstance<TreeNode>;
}

const getIcon = (type: TreeNodeType, isExpanded: boolean) =>
{
	if (type === 'collection') return <FolderOpen className="size-4" />;
	if (type === 'item') return <Package className="size-4" />;
	return <FileText className="size-4" />;
};

export function ItemTreeNode({ item }: ItemTreeNodeProps)
{
	const node = item.getItemData();

	return (
		<button
			{...item.getProps()}
			key={item.getId()}
			style={{ paddingLeft: `${item.getItemMeta().level * 16}px` }}
			className={cn('flex items-center gap-2 w-full px-2 py-1.5 text-sm hover:bg-accent rounded-md transition-colors', {
				'bg-accent': item.isSelected(),
				'font-medium': item.isFocused(),
			})}
		>
			{item.isFolder() && <ChevronRight className={cn('size-3 transition-transform', { 'rotate-90': item.isExpanded() })} />}
			{!item.isFolder() && <span className="w-3" />}
			{getIcon(node.type, item.isExpanded())}
			<span className="truncate">{item.getItemName()}</span>
		</button>
	);
}
