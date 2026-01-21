import { Item } from '@/domain/item';

interface ItemViewProps
{
	item: Item;
}

export function ItemView({ item }: ItemViewProps)
{
	return <div>{item.name}</div>;
}
