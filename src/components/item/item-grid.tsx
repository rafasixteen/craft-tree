import { useItems } from '@/domain/item';
import { useActiveInventory } from '@/components/inventory';
import { ItemCard, useItemGrid } from '@/components/item';

export function ItemGrid()
{
	const inventory = useActiveInventory()!;
	const { items } = useItems(inventory.id);

	const { getItemGridProps, getItemCellProps } = useItemGrid();

	return (
		<div className="grid auto-rows-min grid-cols-2 gap-4 md:grid-cols-6" {...getItemGridProps()}>
			{items.map((item) => (
				<ItemCard key={item.id} item={item} {...getItemCellProps(item.id, items.indexOf(item))} />
			))}
		</div>
	);
}
