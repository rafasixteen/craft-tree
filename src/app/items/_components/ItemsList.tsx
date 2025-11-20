import ItemCard from './ItemCard';

interface ItemsListProps
{
	items: { id: string; name: string; image?: string }[];
}

export default function ItemsList({ items }: ItemsListProps)
{
	return (
		<div className="grid grid-cols-6 gap-4">
			{items.map((item) => (
				<ItemCard key={item.id} item={item} />
			))}
		</div>
	);
}
