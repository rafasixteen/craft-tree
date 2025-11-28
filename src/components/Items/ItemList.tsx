'use client';

import { useEffect, useRef } from 'react';
import styles from './ItemList.module.css';
import ItemCard from './ItemCard';
import { Item } from '@prisma/client';

interface ItemListProps
{
	items: Item[];
	onPageSizeChanged: (pageSize: number) => void;
}

export default function ItemList({ items, onPageSizeChanged }: ItemListProps)
{
	const containerRef = useRef<HTMLDivElement>(null);
	const measureRef = useRef<HTMLDivElement>(null);

	useEffect(() =>
	{
		function calculatePageSize()
		{
			if (!containerRef.current || !measureRef.current) return;

			const containerHeight = containerRef.current.clientHeight;
			const cardHeight = measureRef.current.getBoundingClientRect().height;
			const gap = parseInt(getComputedStyle(containerRef.current).rowGap || '0', 10);

			const count = Math.floor(containerHeight / (cardHeight + gap));
			onPageSizeChanged(count > 0 ? count : 1);
		}

		calculatePageSize();
		window.addEventListener('resize', calculatePageSize);
		return () => window.removeEventListener('resize', calculatePageSize);
	}, [onPageSizeChanged]);

	return (
		<div ref={containerRef} className={styles['item-list']}>
			<div ref={measureRef} className={styles['temp-item-card']}>
				<ItemCard id="temp" name="temp" />
			</div>

			{items.map((item) => (
				<ItemCard key={item.id} {...item} />
			))}
		</div>
	);
}
