import { useActiveInventory } from '@/components/inventory';
import { useItems } from '@/domain/item';
import { Item } from '@/domain/item';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useState, ReactNode, useRef, useMemo, useCallback, useEffect } from 'react';

export interface ItemGridProps
{
	role: string;
	tabIndex: number;
	ref: (node: HTMLDivElement | null) => void;
	onClick: (e: React.MouseEvent) => void;
	onKeyDown: (e: React.KeyboardEvent) => void;
}

export interface ItemCellProps
{
	role: string;
	tabIndex: number;
	'data-selected': boolean;
	'data-hovered': boolean;
	'data-focused': boolean;
	ref: (node: HTMLDivElement | null) => void;
	onClick: (e: React.MouseEvent) => void;
	onDoubleClick: (e: React.MouseEvent) => void;
	onMouseEnter: (e: React.MouseEvent) => void;
	onMouseLeave: (e: React.MouseEvent) => void;
}

interface ItemGridContext
{
	selectedItemIds: Set<Item['id']>;
	clearSelection: () => void;
	getItemGridProps: () => ItemGridProps;
	getItemCellProps: (id: Item['id'], index: number) => ItemCellProps;
}

const ItemGridContext = createContext<ItemGridContext | undefined>(undefined);

interface ItemGridProviderProps
{
	children: ReactNode;
}

export function ItemGridProvider({ children }: ItemGridProviderProps)
{
	const inventory = useActiveInventory()!;
	const { items } = useItems(inventory.id);

	const [selectedItemIds, setSelectedItemIds] = useState<Set<Item['id']>>(new Set());
	const [hoveredItemId, setHoveredItemId] = useState<Item['id'] | null>(null);
	const [focusedItemId, setFocusedItemId] = useState<Item['id'] | null>(null);

	const gridRef = useRef<HTMLDivElement | null>(null);

	const itemRefs = useRef<Map<Item['id'], HTMLDivElement>>(new Map());
	const anchorRef = useRef<Item['id'] | null>(null);

	const itemIds = items.map((item) => item.id);

	const router = useRouter();

	// Selection

	const clearSelection = useCallback(function clearSelection()
	{
		setSelectedItemIds(new Set());
		anchorRef.current = null;
	}, []);

	const selectSingle = useCallback(function selectSingle(id: Item['id'])
	{
		setSelectedItemIds(new Set([id]));
		setFocusedItemId(id);
		anchorRef.current = id;
	}, []);

	const toggleSelection = useCallback(function toggleSelection(id: Item['id'])
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

		setFocusedItemId(id);
	}, []);

	const selectRange = useCallback(
		function selectRange(id: Item['id'], index: number)
		{
			if (!anchorRef.current)
			{
				selectSingle(id);
				return;
			}

			const itemIds = items.map((item) => item.id);

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

			setFocusedItemId(id);
		},
		[selectSingle, items],
	);

	// URL Navigation

	const navigateToItem = useCallback(
		function navigateToItem(id: Item['id'], openType?: 'newTab' | 'popup')
		{
			const href = `/inventory/${inventory.id}/items/${id}`;

			if (openType === 'newTab')
			{
				window.open(href, '_blank');
			}
			else if (openType === 'popup')
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
		[inventory.id, router],
	);

	// Helpers

	const getColumnCount = useCallback(function getColumnCount()
	{
		const grid = gridRef.current;

		if (!grid)
		{
			return 1;
		}

		const children = Array.from(grid.children) as HTMLElement[];

		if (children.length === 0)
		{
			return 1;
		}

		const firstTop = children[0].offsetTop;

		let cols = 0;

		for (const child of children)
		{
			if (child.offsetTop !== firstTop)
			{
				break;
			}

			cols++;
		}

		return cols;
	}, []);

	const navigateCell = useCallback(
		function navigateCell(direction: 'up' | 'down' | 'left' | 'right', e: React.KeyboardEvent)
		{
			if (!focusedItemId)
			{
				return;
			}

			const currentIndex = itemIds.indexOf(focusedItemId);

			if (currentIndex === -1)
			{
				return;
			}

			let nextIndex = currentIndex;
			const columns = getColumnCount();

			switch (direction)
			{
				case 'right':
					nextIndex = currentIndex + 1;
					break;
				case 'left':
					nextIndex = currentIndex - 1;
					break;
				case 'down':
					nextIndex = currentIndex + columns;
					break;
				case 'up':
					nextIndex = currentIndex - columns;
					break;
			}

			if (nextIndex < 0 || nextIndex >= itemIds.length)
			{
				return;
			}

			const nextId = itemIds[nextIndex];

			if (e.shiftKey)
			{
				selectRange(nextId, nextIndex);
			}
			else
			{
				selectSingle(nextId);
			}

			e.preventDefault();
		},
		[focusedItemId, itemIds, getColumnCount, selectRange, selectSingle],
	);

	// Context API

	const getItemGridProps = useCallback(
		function getItemGridProps(): ItemGridProps
		{
			return {
				role: 'grid',
				tabIndex: 0,
				ref: (node: HTMLDivElement | null) =>
				{
					gridRef.current = node;
				},
				onClick: (e: React.MouseEvent) =>
				{
					if (e.target === gridRef.current)
					{
						clearSelection();
					}
				},
				onKeyDown: (e: React.KeyboardEvent) =>
				{
					switch (e.key)
					{
						case 'Escape':
						{
							clearSelection();
							break;
						}
						case 'Enter':
						{
							if (!focusedItemId)
							{
								return;
							}

							if (e.ctrlKey || e.metaKey)
							{
								navigateToItem(focusedItemId, 'newTab');
							}
							else if (e.shiftKey)
							{
								navigateToItem(focusedItemId, 'popup');
							}
							else
							{
								navigateToItem(focusedItemId);
							}

							break;
						}
						case 'ArrowRight':
							navigateCell('right', e);
							break;
						case 'ArrowLeft':
							navigateCell('left', e);
							break;
						case 'ArrowDown':
							navigateCell('down', e);
							break;
						case 'ArrowUp':
							navigateCell('up', e);
							break;
						default:
							return;
					}
				},
			};
		},
		[clearSelection, navigateToItem, navigateCell, focusedItemId],
	);

	const getItemCellProps = useCallback(
		function getItemCellProps(id: Item['id'], index: number): ItemCellProps
		{
			return {
				role: 'gridcell',
				tabIndex: focusedItemId === id ? 0 : -1,
				'data-selected': selectedItemIds.has(id),
				'data-hovered': hoveredItemId === id,
				'data-focused': focusedItemId === id,
				ref: (node: HTMLDivElement | null) =>
				{
					if (node)
					{
						itemRefs.current.set(id, node);
					}
					else
					{
						itemRefs.current.delete(id);
					}
				},
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
					if (e.ctrlKey || e.metaKey)
					{
						navigateToItem(id, 'newTab');
					}
					else if (e.shiftKey)
					{
						navigateToItem(id, 'popup');
					}
					else
					{
						navigateToItem(id);
					}
				},
				onMouseEnter: () =>
				{
					setHoveredItemId(id);
				},
				onMouseLeave: () =>
				{
					setHoveredItemId((current) => (current === id ? null : current));
				},
			};
		},
		[selectedItemIds, hoveredItemId, focusedItemId, selectRange, selectSingle, toggleSelection, navigateToItem],
	);

	// Others

	useEffect(() =>
	{
		if (!focusedItemId)
		{
			return;
		}

		const element = itemRefs.current.get(focusedItemId);

		if (element)
		{
			element.focus();
		}
	}, [focusedItemId]);

	const value = useMemo(() =>
	{
		return {
			selectedItemIds,
			clearSelection,
			getItemGridProps,
			getItemCellProps,
		};
	}, [selectedItemIds, clearSelection, getItemGridProps, getItemCellProps]);

	return <ItemGridContext.Provider value={value}>{children}</ItemGridContext.Provider>;
}

export function useItemGrid()
{
	const ctx = useContext(ItemGridContext);

	if (!ctx)
	{
		throw new Error('useItemGrid must be used within ItemGridProvider');
	}

	return ctx;
}
