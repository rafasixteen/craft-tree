'use client';

import useSWR from 'swr';
import styles from './ItemList.module.css';
import ItemCard from './ItemCard';
import { getItems, deleteItem } from '@/lib/items';

interface ItemListProps
{
	search: string;
}

export default function ItemList({ search }: ItemListProps)
{
	const { data: items, mutate } = useSWR(['items', search], () => getItems({ search, skip: 0, take: 50 }), {
		refreshInterval: 300,
	});

	async function handleDelete(id: string)
	{
		await deleteItem(id);
		mutate();
	}

	if (!items)
	{
		return <div>Loading...</div>;
	}

	return (
		<div className={styles['item-list']}>
			{items.map((item) => (
				<ItemCard key={item.id} item={item} onDelete={handleDelete} />
			))}
		</div>
	);
}
