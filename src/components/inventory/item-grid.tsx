import { useItems } from '@/domain/inventory';
import { ItemCard, useActiveInventory } from '@/components/inventory';
import { useItemSelection } from './hooks/use-item-selection';
import React from 'react';


interface ItemGridProps {
       onItemIdsChange?: (ids: string[]) => void;
}

export function ItemGrid({ onItemIdsChange }: ItemGridProps)
{
       const inventory = useActiveInventory()!;
       const { items } = useItems(inventory.id);
       const { selectedIds, setSelectedIds, toggleSelection, isSelected, clearSelection } = useItemSelection();

       // Track the last selected index for shift selection
       const lastSelectedIndex = React.useRef<number | null>(null);
       const gridRef = React.useRef<HTMLDivElement>(null);

       React.useEffect(() => {
	       if (onItemIdsChange) {
		       onItemIdsChange(items.map(i => i.id));
	       }
       }, [items, onItemIdsChange]);

       const handleCardClick = (e: React.MouseEvent, id: string, idx: number) =>
       {
	       e.preventDefault();
	       e.stopPropagation();

	       if (e.shiftKey && lastSelectedIndex.current !== null)
	       {
		       // Range select
		       const start = Math.min(lastSelectedIndex.current, idx);
		       const end = Math.max(lastSelectedIndex.current, idx);
		       const rangeIds = items.slice(start, end + 1).map((item) => item.id);
		       const newSelected = Array.from(new Set([...selectedIds, ...rangeIds]));
		       setSelectedIds(newSelected);
	       }
	       else if (e.ctrlKey || e.metaKey)
	       {
		       // Toggle single selection
		       toggleSelection(id);
		       lastSelectedIndex.current = idx;
	       }
	       else
	       {
		       // Single select
		       setSelectedIds([id]);
		       lastSelectedIndex.current = idx;
	       }
       };

	React.useEffect(() =>
	{
		function handleDocumentOrEscape(e: MouseEvent | KeyboardEvent)
		{
			// Handle click outside grid
			if (e instanceof MouseEvent)
			{
				if (!gridRef.current) return;
				if (!gridRef.current.contains(e.target as Node))
				{
					clearSelection();
				}
			}
			// Handle Escape key
			if (e instanceof KeyboardEvent && e.key === 'Escape')
			{
				clearSelection();
			}
		}
		document.addEventListener('mousedown', handleDocumentOrEscape);
		document.addEventListener('keydown', handleDocumentOrEscape);
		return () =>
		{
			document.removeEventListener('mousedown', handleDocumentOrEscape);
			document.removeEventListener('keydown', handleDocumentOrEscape);
		};
	}, [clearSelection]);

	return (
		<div
			ref={gridRef}
			className="grid auto-rows-min gap-4 md:grid-cols-6"
			onClick={(e) =>
			{
				// If the click is directly on the grid (not a card), clear selection
				if (e.target === e.currentTarget)
				{
					clearSelection();
				}
			}}
		>
			{items.map((item, idx) => (
				<ItemCard
					key={item.id}
					item={item}
					className={`aspect-square rounded-xl${isSelected(item.id) ? ' ring-2 ring-primary' : ''}`}
					onClick={(e: React.MouseEvent) => handleCardClick(e, item.id, idx)}
					selected={isSelected(item.id)}
				/>
			))}
		</div>
	);
}
