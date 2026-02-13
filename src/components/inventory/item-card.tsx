import { Card } from '@/components/ui/card';
import { Item } from '@/domain/item';

interface ItemCardProps
{
	item: Item;
}

export function ItemCard({ item }: ItemCardProps)
{
	return (
		<Card>
			<p>{item.name}</p>
		</Card>
	);
}
