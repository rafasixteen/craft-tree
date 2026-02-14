import { createContext, useContext, useState, ReactNode, useRef, useCallback, useMemo } from 'react';

interface ItemSelectionContextProps
{
	selectedIds: string[];
	hasAnySelection: boolean;
	setSelectedIds: (ids: string[]) => void;
	clearSelection: () => void;
	toggleSelection: (id: string) => void;
	isSelected: (id: string) => boolean;
	selectRange: (id: string, index: number, items: { id: string }[], multi?: boolean, range?: boolean) => void;
}

const ItemSelectionContext = createContext<ItemSelectionContextProps | undefined>(undefined);

interface ItemSelectionProviderProps
{
	children: ReactNode;
}

export function ItemSelectionProvider({ children }: ItemSelectionProviderProps)
{
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const lastSelectedIndex = useRef<number | null>(null);

	const clearSelection = useCallback(() =>
	{
		setSelectedIds([]);
		lastSelectedIndex.current = null;
	}, []);

	const toggleSelection = useCallback(function toggleSelection(id: string)
	{
		setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
	}, []);

	const isSelected = useCallback(
		function isSelected(id: string)
		{
			return selectedIds.includes(id);
		},
		[selectedIds],
	);

	const selectRange = useCallback(
		function selectRange(id: string, index: number, items: { id: string }[], multi = false, range = false)
		{
			if (range && lastSelectedIndex.current !== null)
			{
				// Shift selection range
				const start = Math.min(lastSelectedIndex.current, index);
				const end = Math.max(lastSelectedIndex.current, index);
				const rangeIds = items.slice(start, end + 1).map((item) => item.id);
				setSelectedIds((prev) => Array.from(new Set([...prev, ...rangeIds])));
			}
			else if (multi)
			{
				// Ctrl/Cmd toggle
				toggleSelection(id);
				lastSelectedIndex.current = index;
			}
			else if (range && lastSelectedIndex.current === null)
			{
				// Shift pressed but no prior selection → select just this one
				setSelectedIds([id]);
				lastSelectedIndex.current = index;
			}
			else if (selectedIds.length > 0)
			{
				// Regular click
				setSelectedIds([id]);
				lastSelectedIndex.current = index;
			}
		},
		[selectedIds, toggleSelection],
	);

	const hasAnySelection = useMemo(() =>
	{
		return selectedIds.length > 0;
	}, [selectedIds]);

	const value = useMemo(
		() => ({ selectedIds, setSelectedIds, clearSelection, toggleSelection, isSelected, selectRange, hasAnySelection }),
		[selectedIds, toggleSelection, isSelected, selectRange, clearSelection, hasAnySelection],
	);

	return <ItemSelectionContext.Provider value={value}>{children}</ItemSelectionContext.Provider>;
}

export function useItemSelection()
{
	const ctx = useContext(ItemSelectionContext);
	if (!ctx) throw new Error('useItemSelection must be used within ItemSelectionProvider');
	return ctx;
}
