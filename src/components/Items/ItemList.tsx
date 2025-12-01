'use client';

import useSWR from 'swr';
import styles from './ItemList.module.css';
import ItemCard from './ItemCard';
import { getItems, deleteItem, createItem, updateItem } from '@/lib/items';
import { useRef, useState } from 'react';
import type { Item } from '@/graphql/generated/graphql';

interface ItemListProps
{
	search: string;
}

export default function ItemList({ search }: ItemListProps)
{
	const { data: items, mutate } = useSWR(['items', search], () => getItems({ search, skip: 0, take: 50 }), { refreshInterval: 300 });

	const listRef = useRef<HTMLDivElement>(null);
	const [editingItemId, setEditingItemId] = useState<string | null>(null);

	function handleDelete(id: string)
	{
		deleteItem(id).then(() => mutate());
	}

	async function addItem()
	{
		const newItem = await createItem({ data: { name: 'New Item' } });

		mutate((currentItems = []) => [...currentItems, newItem], false);

		setEditingItemId(newItem.id);

		listRef.current?.scrollTo({
			top: listRef.current.scrollHeight,
			behavior: 'smooth',
		});
	}

	function saveItem(item: Item)
	{
		updateItem({ data: { id: item.id, name: item.name } }).then((updatedItem) =>
		{
			mutate((currentItems: Item[] = []) => currentItems.map((i) => (i.id === item.id ? updatedItem : i)), false);
			setEditingItemId(null);
		});
	}

	function cancelEdit()
	{
		setEditingItemId(null);
	}

	if (!items)
	{
		// TODO: Change to a spinner component
		return <div>Loading...</div>;
	}

	return (
		<>
			<div className={styles['item-list']} ref={listRef}>
				{items.map((item) => (
					<ItemCard key={item.id} item={item} onDelete={handleDelete} isEditing={editingItemId === item.id} setEditing={setEditingItemId} saveItem={saveItem} cancelEdit={cancelEdit} />
				))}
			</div>

			<button className={styles['add-button']} onClick={addItem} disabled={editingItemId !== null}>
				Add Item
			</button>
		</>
	);
}
