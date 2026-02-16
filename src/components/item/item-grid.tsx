import { ItemCell } from '@/components/item';
import { useItemGridGeneric } from '@/components/grid';
import { Item } from '@/domain/item';

export function ItemGrid()
{
	const { items, getItemGridProps, getItemCellProps } = useItemGridGeneric<Item>();
	return (
		<div className="grid auto-rows-min grid-cols-2 gap-4 md:grid-cols-6" {...getItemGridProps()}>
			{items.map((item) => (
				<ItemCell key={item.id} {...getItemCellProps(item.id, items.indexOf(item))} />
			))}
		</div>
	);
}
