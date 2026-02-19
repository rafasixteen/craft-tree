import { ItemCell } from '@/components/item';
import { useGrid } from '@/components/grid';
import { Item } from '@/domain/item';

export function ItemGrid()
{
	const { cells: items, getGridProps, getCellProps } = useGrid<Item>();

	return (
		<div className="grid auto-rows-min grid-cols-2 gap-4 md:grid-cols-6" {...getGridProps()}>
			{items.map((item, index) => (
				<ItemCell key={item.id} {...getCellProps(item.id, index)} />
			))}
		</div>
	);
}
