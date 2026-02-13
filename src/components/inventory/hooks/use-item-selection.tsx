import React, { createContext, useContext, useState } from 'react';

interface ItemSelectionContext
{
	selectedIds: string[];
	setSelectedIds: (ids: string[]) => void;
	clearSelection: () => void;
	toggleSelection: (id: string) => void;
	isSelected: (id: string) => boolean;
}

const ItemSelectionContext = createContext<ItemSelectionContext | undefined>(undefined);

interface ItemSelectionProviderProps
{
	children: React.ReactNode;
}

export function ItemSelectionProvider({ children }: ItemSelectionProviderProps)
{
	const [selectedIds, setSelectedIds] = useState<string[]>([]);

	const clearSelection = () => setSelectedIds([]);
	const toggleSelection = (id: string) => setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
	const isSelected = (id: string) => selectedIds.includes(id);

	const value = {
		selectedIds,
		setSelectedIds,
		clearSelection,
		toggleSelection,
		isSelected,
	};

	return <ItemSelectionContext.Provider value={value}>{children}</ItemSelectionContext.Provider>;
}

export function useItemSelection()
{
	const ctx = useContext(ItemSelectionContext);

	if (!ctx)
	{
		throw new Error('useItemSelection must be used within ItemSelectionProvider');
	}

	return ctx;
}
