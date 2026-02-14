import { useItems } from '@/domain/inventory';
import { ItemCard, useActiveInventory, useItemSelection } from '@/components/inventory';
import { useEffect, useRef } from 'react';

export function ItemGrid()
{
	const inventory = useActiveInventory()!;
	const { items } = useItems(inventory.id);
	const { selectRange, clearSelection } = useItemSelection();

	const gridRef = useRef<HTMLDivElement>(null);

	useEffect(() =>
	{
		function handleDocumentOrEscape(e: MouseEvent | KeyboardEvent)
		{
			// Handle Escape key
			if (e instanceof KeyboardEvent && e.key === 'Escape')
			{
				clearSelection();
			}
		}

		document.addEventListener('keydown', handleDocumentOrEscape);

		return () =>
		{
			document.removeEventListener('keydown', handleDocumentOrEscape);
		};
	}, [clearSelection]);

	function onGridClick(e: React.MouseEvent)
	{
		// If the click is directly on the grid (not a card), clear selection
		if (e.target === e.currentTarget)
		{
			clearSelection();
		}
	}

	function onCardClick(e: React.MouseEvent, id: string, idx: number)
	{
		e.preventDefault();
		e.stopPropagation();

		selectRange(id, idx, items, e.ctrlKey || e.metaKey, e.shiftKey);
	}

	return (
		<div ref={gridRef} className="grid auto-rows-min gap-4 md:grid-cols-6" onClick={onGridClick}>
			{items.map((item, index) => (
				<ItemCard key={item.id} item={item} onClick={(e) => onCardClick(e, item.id, index)} />
			))}
		</div>
	);
}
