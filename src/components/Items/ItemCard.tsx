'use client';

import { Item } from '@prisma/client';
import styles from './ItemCard.module.css';

export default function ItemCard(item: Item)
{
	return (
		<div className={styles.card}>
			<span>{item.name}</span>
		</div>
	);
}
