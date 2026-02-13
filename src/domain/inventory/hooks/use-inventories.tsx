'use client';

import { createContext, useContext, useMemo, useCallback } from 'react';
import { Inventory, getInventories } from '@/domain/inventory';
import * as InventoryServerActions from '@/domain/inventory/server';
import useSWR from 'swr';

interface InventoriesContext
{
	inventories: Inventory[];
	isLoading: boolean;
	createInventory: (name: string) => Promise<void>;
	updateInventory: (id: Inventory['id'], newName: string) => Promise<void>;
	deleteInventory: (id: Inventory['id']) => Promise<void>;
}

const InventoriesContext = createContext<InventoriesContext | undefined>(undefined);

interface InventoriesProviderProps
{
	userId: string;
	initialData: Inventory[];
	children: React.ReactNode;
}

export function InventoriesProvider({ userId, initialData, children }: InventoriesProviderProps)
{
	const swrKey = ['inventories', userId];

	const {
		data: inventories,
		mutate,
		isLoading,
	} = useSWR<Inventory[]>(swrKey, () => getInventories(userId), {
		fallbackData: initialData,
		revalidateOnMount: false,
	});

	const createInventory = useCallback(
		async (name: string) =>
		{
			const optimistic: Inventory = {
				id: crypto.randomUUID(),
				name,
				userId,
			};

			await mutate(
				async (current = []) =>
				{
					const created = await InventoryServerActions.createInventory({ name, userId });
					return [...current, created];
				},
				{
					optimisticData: (current: Inventory[] = []) => [...current, optimistic],
					rollbackOnError: true,
					revalidate: false,
				},
			);
		},
		[mutate, userId],
	);

	const updateInventory = useCallback(
		async (id: Inventory['id'], newName: string) =>
		{
			await mutate(
				async (current = []) =>
				{
					const updated = await InventoryServerActions.updateInventory({
						inventoryId: id,
						newName: newName,
					});

					return current.map((inventory) => (inventory.id === id ? updated : inventory));
				},
				{
					optimisticData: (current: Inventory[] = []) => current.map((inv) => (inv.id === id ? { ...inv, name: newName } : inv)),
					rollbackOnError: true,
					revalidate: false,
				},
			);
		},
		[mutate],
	);

	const deleteInventory = useCallback(
		async (id: string) =>
		{
			await mutate(
				async (current = []) =>
				{
					await InventoryServerActions.deleteInventory({ inventoryId: id });
					return current.filter((inv) => inv.id !== id);
				},
				{
					optimisticData: (current: Inventory[] = []) => current.filter((inv) => inv.id !== id),
					rollbackOnError: true,
					revalidate: false,
				},
			);
		},
		[mutate],
	);

	const value = useMemo(
		() => ({
			inventories: inventories ?? [],
			isLoading,
			createInventory,
			updateInventory,
			deleteInventory,
		}),
		[inventories, isLoading, createInventory, updateInventory, deleteInventory],
	);

	return <InventoriesContext.Provider value={value}>{children}</InventoriesContext.Provider>;
}

export function useInventories(): InventoriesContext
{
	const context = useContext(InventoriesContext);

	if (!context)
	{
		throw new Error('useInventories must be used within an InventoriesProvider');
	}

	return context;
}
