'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import { InventoryData, InventoryTreeState, parseInventoryData } from '@/domain/inventory';

interface InventoryContext
{
	inventory: InventoryTreeState;
}

const InventoryContext = createContext<InventoryContext | undefined>(undefined);

interface InventoryProviderProps
{
	data: InventoryData;
	children: React.ReactNode;
}

export function InventoryProvider({ children, data }: InventoryProviderProps)
{
	const [inventory, setInventory] = useState<InventoryTreeState>(() => parseInventoryData(data));

	const value = useMemo(() => ({ inventory }), [inventory]);

	return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
}

export function useInventory(): InventoryContext
{
	const context = useContext(InventoryContext);

	if (!context)
	{
		throw new Error('useInventory must be used within an InventoryProvider');
	}

	return context;
}
