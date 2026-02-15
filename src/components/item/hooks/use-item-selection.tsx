import { useActiveInventory } from '@/components/inventory';
import { useItems } from '@/domain/item';
import { Item } from '@/domain/item';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useState, ReactNode, useRef, useMemo } from 'react';

interface ItemProps
{
	onClick: (e: React.MouseEvent) => void;
	onDoubleClick: (e: React.MouseEvent) => void;
	onMouseEnter: (e: React.MouseEvent) => void;
	onMouseLeave: (e: React.MouseEvent) => void;
}

interface ItemSelectionContext
{
	selectedItemIds: Set<Item['id']>;
	getItemProps: (id: Item['id'], index: number) => ItemProps;
}

const ItemSelectionContext = createContext<ItemSelectionContext | undefined>(undefined);

interface ItemSelectionProviderProps
{
	children: ReactNode;
}

export function ItemSelectionProvider({ children }: ItemSelectionProviderProps)
{
	const inventory = useActiveInventory()!;
	const { items } = useItems(inventory.id);

	const [selectedItemIds, setSelectedItemIds] = useState<Set<Item['id']>>(new Set());

	const itemIds = items.map((item) => item.id);

	// This will be used to track the "anchor" item for shift-click range selection.
	const anchorRef = useRef<Item['id'] | null>(null);

	const router = useRouter();

	function clearSelection()
	{
		setSelectedItemIds(new Set());
		anchorRef.current = null;
	}

	function selectSingle(id: Item['id'])
	{
		setSelectedItemIds(new Set([id]));
		anchorRef.current = id;
	}

	function toggleSelection(id: Item['id'])
	{
		setSelectedItemIds((prev) =>
		{
			const next = new Set(prev);

			if (next.has(id))
			{
				next.delete(id);
			}
			else
			{
				next.add(id);
			}

			return next;
		});
	}

	function selectRange(id: Item['id'], index: number)
	{
		if (!anchorRef.current)
		{
			selectSingle(id);
			return;
		}

		const startIndex = itemIds.indexOf(anchorRef.current);
		const endIndex = index;

		if (startIndex === -1 || endIndex === -1)
		{
			selectSingle(id);
			return;
		}

		const [min, max] = [Math.min(startIndex, endIndex), Math.max(startIndex, endIndex)];
		const rangeIds = itemIds.slice(min, max + 1);

		setSelectedItemIds((prev) =>
		{
			const next = new Set(prev);
			rangeIds.forEach((rangeId) => next.add(rangeId));
			return next;
		});
	}

	function getItemProps(id: Item['id'], index: number): ItemProps
	{
		return {
			onClick: (e: React.MouseEvent) =>
			{
				if (e.shiftKey)
				{
					selectRange(id, index);
				}
				else if (e.metaKey || e.ctrlKey)
				{
					toggleSelection(id);
				}
				else
				{
					selectSingle(id);
				}
			},

			onDoubleClick: (e: React.MouseEvent) =>
			{
				const href = '/inventory/' + inventory.id + '/items/' + id;

				if (e.ctrlKey || e.metaKey)
				{
					window.open(href, '_blank');
				}
				else if (e.shiftKey)
				{
					const aspectRatio = 16 / 9;
					const height = 600;
					const width = Math.round(height * aspectRatio);

					const left = window.screen.width - width;
					const top = 0;

					window.open(href, '_blank', `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes`);
				}
				else
				{
					router.push(href);
				}
			},

			onMouseEnter: () =>
			{
				/* Optional: hover logic */
			},

			onMouseLeave: () =>
			{
				/* Optional: hover logic */
			},
		};
	}

	const value = useMemo(() =>
	{
		return {
			selectedItemIds,
			getItemProps,
		};
	}, [selectedItemIds, getItemProps]);

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
