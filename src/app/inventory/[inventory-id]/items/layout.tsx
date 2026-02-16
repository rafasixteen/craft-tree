'use client';

import { useActiveInventory } from '@/components/inventory/hooks/use-active-inventory';
import { ItemGridProviderGeneric } from '@/components/grid';
import { useItems } from '@/domain/item/hooks/use-items';
import { useCallback } from 'react';
import { Item } from '@/domain/item';

interface ItemsLayoutProps
{
	children: React.ReactNode;
}

export default function ItemsLayout({ children }: ItemsLayoutProps)
{
	const inventory = useActiveInventory();
	const { items } = useItems(inventory.id);

	const getItemHref = useCallback(
		function getItemHref(id: string)
		{
			return `/inventory/${inventory.id}/items/${id}`;
		},
		[inventory.id],
	);

	return (
		<ItemGridProviderGeneric<Item> items={items} getItemHref={getItemHref}>
			{children}
		</ItemGridProviderGeneric>
	);
}
