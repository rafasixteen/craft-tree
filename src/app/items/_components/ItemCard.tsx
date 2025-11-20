interface ItemCardProps
{
	item: { id: string; name: string; image?: string };
}

export default function ItemCard({ item }: ItemCardProps)
{
	return (
		<div className="border rounded p-2 flex flex-col items-center">
			{item.image && <img src={item.image} alt={item.name} className="w-16 h-16 mb-2" />}
			<span>{item.name}</span>
		</div>
	);
}
