'use client';

import { useActiveInventory } from '@/components/inventory/hooks/use-active-inventory';
import { ItemGridProviderGeneric } from '@/components/grid';
import { Producer, useProducers } from '@/domain/producer';
import {} from '@/domain/producer/hooks/use-producers';
import { useCallback } from 'react';

interface ProducersLayoutProps
{
	children: React.ReactNode;
}

export default function ProducersLayout({ children }: ProducersLayoutProps)
{
	const inventory = useActiveInventory();
	const { producers } = useProducers(inventory.id);

	const getItemHref = useCallback(
		function getItemHref(id: string)
		{
			return `/inventory/${inventory.id}/producers/${id}`;
		},
		[inventory.id],
	);

	return (
		<ItemGridProviderGeneric<Producer> items={producers} getItemHref={getItemHref}>
			{children}
		</ItemGridProviderGeneric>
	);
}
