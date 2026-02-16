'use client';

import { useActiveInventory } from '@/components/inventory/hooks/use-active-inventory';
import { ItemGridProviderGeneric, useItemGridGeneric } from '@/components/item';
import { useItems } from '@/domain/item';
import { Producer } from '@/domain/producer';
import { useCallback } from 'react';

interface ProducersLayoutProps
{
	children: React.ReactNode;
}

export default function ProducersLayout({ children }: ProducersLayoutProps)
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
		<ItemGridProviderGeneric<Producer> items={items} getItemHref={getItemHref}>
			{children}
		</ItemGridProviderGeneric>
	);
}
