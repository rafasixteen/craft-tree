import { useRouter } from 'next/navigation';
import { createContext, useContext, useState, ReactNode, useRef, useMemo, useCallback, useEffect } from 'react';

interface Identifiable
{
	id: string | number;
}

export interface GridProps
{
	role: string;
	tabIndex: number;
	ref: (node: HTMLDivElement | null) => void;
	onClick: (e: React.MouseEvent) => void;
	onKeyDown: (e: React.KeyboardEvent) => void;
}

export interface CellProps<T extends Identifiable>
{
	data: T;
	role: string;
	tabIndex: number;
	'data-selected': boolean;
	'data-hovered': boolean;
	'data-focused': boolean;
	ref: (node: HTMLDivElement | null) => void;
	onClick: (e: React.MouseEvent) => void;
	onDoubleClick: (e: React.MouseEvent) => void;
	onContextMenu: (e: React.MouseEvent) => void;
	onMouseEnter: (e: React.MouseEvent) => void;
	onMouseLeave: (e: React.MouseEvent) => void;
}

interface GridContext<T extends Identifiable>
{
	cells: T[];

	selectedCellIds: Set<T['id']>;
	clearSelection: () => void;

	editingCell: T | null;
	startEditingCell: (cell: T) => void;
	stopEditingCell: () => void;

	getGridProps: () => GridProps;
	getCellProps: (id: T['id'], index: number) => CellProps<T>;
}

const GridContext = createContext<GridContext<any> | undefined>(undefined);

interface GridProviderProps<T extends Identifiable>
{
	cells: T[];
	getCellHref: (id: T['id']) => string;
	children: ReactNode;
}

export function GridProvider<T extends Identifiable>({ cells, getCellHref, children }: GridProviderProps<T>)
{
	const [selectedCellIds, setSelectedCellIds] = useState<Set<T['id']>>(new Set());
	const [hoveredCellId, setHoveredCellId] = useState<T['id'] | null>(null);
	const [focusedCellId, setFocusedCellId] = useState<T['id'] | null>(null);
	const [editingCell, setEditingCell] = useState<T | null>(null);

	const gridRef = useRef<HTMLDivElement | null>(null);

	const cellRefs = useRef<Map<T['id'], HTMLDivElement>>(new Map());
	const anchorRef = useRef<T['id'] | null>(null);

	const cellIds = cells.map((cell) => cell.id);

	const router = useRouter();

	// Selection

	const clearSelection = useCallback(function clearSelection()
	{
		setSelectedCellIds(new Set());
		anchorRef.current = null;
	}, []);

	const selectSingle = useCallback(function selectSingle(id: T['id'])
	{
		setSelectedCellIds(new Set([id]));
		setFocusedCellId(id);
		anchorRef.current = id;
	}, []);

	const toggleSelection = useCallback(function toggleSelection(id: T['id'])
	{
		setSelectedCellIds((prev) =>
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

		setFocusedCellId(id);
	}, []);

	const selectRange = useCallback(
		function selectRange(id: T['id'], index: number)
		{
			if (!anchorRef.current)
			{
				selectSingle(id);
				return;
			}

			const cellIds = cells.map((cell) => cell.id);

			const startIndex = cellIds.indexOf(anchorRef.current);
			const endIndex = index;

			if (startIndex === -1 || endIndex === -1)
			{
				selectSingle(id);
				return;
			}

			const [min, max] = [Math.min(startIndex, endIndex), Math.max(startIndex, endIndex)];
			const rangeIds = cellIds.slice(min, max + 1);

			setSelectedCellIds((prev) =>
			{
				const next = new Set(prev);
				rangeIds.forEach((rangeId) => next.add(rangeId));
				return next;
			});

			setFocusedCellId(id);
		},
		[selectSingle, cells],
	);

	// Editing

	const startEditingCell = useCallback(function startEditingCell(cell: T)
	{
		setEditingCell(cell);
	}, []);

	const stopEditingCell = useCallback(function stopEditingCell()
	{
		setEditingCell(null);
	}, []);

	// URL Navigation

	const navigateToCell = useCallback(
		function navigateToCell(id: T['id'], openType?: 'newTab' | 'popup')
		{
			const href = getCellHref(id);

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
		[getCellHref, router],
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
			if (!focusedCellId)
			{
				return;
			}

			const currentIndex = cellIds.indexOf(focusedCellId);

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

			if (nextIndex < 0 || nextIndex >= cellIds.length)
			{
				return;
			}

			const nextId = cellIds[nextIndex];

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
		[focusedCellId, cellIds, getColumnCount, selectRange, selectSingle],
	);

	// Context API

	const getGridProps = useCallback(
		function getGridProps(): GridProps
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
							if (!focusedCellId)
							{
								return;
							}

							if (e.ctrlKey || e.metaKey)
							{
								navigateToCell(focusedCellId, 'newTab');
							}
							else if (e.shiftKey)
							{
								navigateToCell(focusedCellId, 'popup');
							}
							else
							{
								navigateToCell(focusedCellId);
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
		[clearSelection, navigateToCell, navigateCell, focusedCellId],
	);

	const getCellProps = useCallback(
		function getCellProps(id: T['id'], index: number): CellProps<T>
		{
			return {
				data: cells.find((cell) => cell.id === id)!,
				role: 'gridcell',
				tabIndex: focusedCellId === id ? 0 : -1,
				'data-selected': selectedCellIds.has(id),
				'data-hovered': hoveredCellId === id,
				'data-focused': focusedCellId === id,
				ref: (node: HTMLDivElement | null) =>
				{
					if (node)
					{
						cellRefs.current.set(id, node);
					}
					else
					{
						cellRefs.current.delete(id);
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
						navigateToCell(id, 'newTab');
					}
					else if (e.shiftKey)
					{
						navigateToCell(id, 'popup');
					}
					else
					{
						navigateToCell(id);
					}
				},
				onContextMenu(e: React.MouseEvent)
				{
					selectSingle(id);
				},
				onMouseEnter: () =>
				{
					setHoveredCellId(id);
				},
				onMouseLeave: () =>
				{
					setHoveredCellId((current) => (current === id ? null : current));
				},
			};
		},
		[cells, selectedCellIds, hoveredCellId, focusedCellId, selectRange, selectSingle, toggleSelection, navigateToCell],
	);

	// Others

	useEffect(() =>
	{
		if (!focusedCellId)
		{
			return;
		}

		const element = cellRefs.current.get(focusedCellId);

		if (element)
		{
			element.focus();
		}
	}, [focusedCellId]);

	const value = useMemo(() =>
	{
		return {
			cells,

			selectedCellIds,
			clearSelection,

			editingCell,
			startEditingCell,
			stopEditingCell,

			getGridProps,
			getCellProps,
		};
	}, [cells, selectedCellIds, clearSelection, editingCell, startEditingCell, stopEditingCell, getGridProps, getCellProps]);

	return <GridContext.Provider value={value}>{children}</GridContext.Provider>;
}

export function useGrid<T extends Identifiable>()
{
	const ctx = useContext(GridContext as React.Context<GridContext<T> | undefined>);

	if (!ctx)
	{
		throw new Error('useGrid must be used within GridProvider');
	}

	return ctx;
}
