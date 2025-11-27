'use server';

import styles from './ItemList.module.css';
import { getItems } from '@/lib/items';
import ItemCard from './ItemCard';

interface ItemListProps
{
	page: number;
	pageSize: number;
	search?: string;
}

export default async function ItemList({ page, pageSize, search }: ItemListProps)
{
	const { items } = await getItems({ page, pageSize, search });

	return (
		<div className={styles['item-list']}>
			{items.map((item) => (
				<ItemCard key={item.id} {...item} />
			))}
		</div>
	);
}
