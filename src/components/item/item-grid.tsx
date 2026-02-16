import { ItemCell, useItemGrid } from '@/components/item';

export function ItemGrid()
{
	const { items, getItemGridProps, getItemCellProps } = useItemGrid();

	return (
		<div className="grid auto-rows-min grid-cols-2 gap-4 md:grid-cols-6" {...getItemGridProps()}>
			{items.map((item) => (
				<ItemCell key={item.id} {...getItemCellProps(item.id, items.indexOf(item))} />
			))}
		</div>
	);
}
