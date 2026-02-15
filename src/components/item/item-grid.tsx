import { useItems } from '@/domain/item';
import { useActiveInventory } from '@/components/inventory';
import { ItemCell, useItemGrid } from '@/components/item';

export function ItemGrid()
{
	const inventory = useActiveInventory()!;
	const { items } = useItems(inventory.id);

	const { getItemGridProps, getItemCellProps } = useItemGrid();

	return (
		<div className="grid auto-rows-min grid-cols-2 gap-4 md:grid-cols-6" {...getItemGridProps()}>
			{items.map((item) => (
				<ItemCell key={item.id} {...getItemCellProps(item.id, items.indexOf(item))} />
			))}
		</div>
	);
}
