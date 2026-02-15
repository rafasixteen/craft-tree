import { useItems } from '@/domain/item';
import { useActiveInventory } from '@/components/inventory';
import { ItemCard, useItemSelection } from '@/components/item';

export function ItemGrid()
{
	const inventory = useActiveInventory()!;
	const { items } = useItems(inventory.id);

	const { getItemProps } = useItemSelection();

	return (
		<div className="grid auto-rows-min gap-4 md:grid-cols-6">
			{items.map((item) => (
				<ItemCard key={item.id} item={item} {...getItemProps(item.id, items.indexOf(item))} />
			))}
		</div>
	);
}
