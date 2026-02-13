'use client';

import { createContext, useContext, useEffect, useMemo } from 'react';
import { Item } from '@/domain/item';
import { Inventory, getInventoryItems, getInventoryProducers, useInventories } from '@/domain/inventory';
import { Producer } from '@/domain/producer/types/producer';
import { useLocalStorage } from 'usehooks-ts';
import * as ItemServerActions from '@/domain/item/server';
import useSWR from 'swr';

interface ActiveInventoryContext
{
	inventory: Inventory | null;
	setInventory: (inventoryId: Inventory['id']) => void;

	items: Item[];
	createItem: (item: Omit<Item, 'id' | 'inventoryId'>) => Promise<void>;
	// updateItem: (itemId: Item['id'], newName: string) => Promise<void>;
	// deleteItem: (itemId: Item['id']) => Promise<void>;

	// producers: Producer[];
	// createProducer: (name: string) => Promise<void>;
	// updateProducer: (producerId: Producer['id'], newName: string) => Promise<void>;
	// deleteProducer: (producerId: Producer['id']) => Promise<void>;
}

const ActiveInventoryContext = createContext<ActiveInventoryContext | undefined>(undefined);

interface ActiveInventoryProviderProps
{
	children: React.ReactNode;
}

export function ActiveInventoryProvider({ children }: ActiveInventoryProviderProps)
{
	const { inventories } = useInventories();

	const [inventoryId, setInventoryId] = useLocalStorage<Inventory['id']>('activeInventoryId', inventories[0]?.id ?? null);

	const inventory = useMemo(() =>
	{
		return inventories.find((inv) => inv.id === inventoryId) ?? null;
	}, [inventories, inventoryId]);

	const itemsKey = inventory ? ['inventoryItems', inventory.id] : null;
	const producersKey = inventory ? ['inventoryProducers', inventory.id] : null;

	const itemsFetcher = inventory ? () => getInventoryItems(inventory.id) : null;
	const producersFetcher = inventory ? () => getInventoryProducers(inventory.id) : null;

	const { data: items, mutate: mutateItems } = useSWR<Item[]>(itemsKey, itemsFetcher, {
		revalidateOnFocus: false,
	});

	const { data: producers, mutate: mutateProducers } = useSWR<Producer[]>(producersKey, producersFetcher, {
		revalidateOnFocus: false,
	});

	async function createItem(item: Omit<Item, 'id' | 'inventoryId'>)
	{
		if (!items || !inventory) return;

		const { name, icon } = item;

		const optimistic: Item = {
			id: crypto.randomUUID(),
			name,
			icon,
			inventoryId: inventory.id,
		};

		await mutateItems(
			async (current = []) =>
			{
				const created = await ItemServerActions.createItem({
					name: item.name,
					icon: item.icon,
					inventoryId: inventory.id,
				});

				return [...current, created];
			},
			{
				optimisticData: (current = []) => [...current, optimistic],
				rollbackOnError: true,
				revalidate: false,
			},
		);
	}

	const value = useMemo(
		() => ({
			inventory,
			setInventory: setInventoryId,
			items: items ?? [],
			createItem,
		}),
		[inventory, setInventoryId, items, createItem],
	);

	return <ActiveInventoryContext.Provider value={value}>{children}</ActiveInventoryContext.Provider>;
}

export function useInventory(): ActiveInventoryContext
{
	const context = useContext(ActiveInventoryContext);

	if (!context)
	{
		throw new Error('useInventory must be used within an ActiveInventoryProvider');
	}

	return context;
}
