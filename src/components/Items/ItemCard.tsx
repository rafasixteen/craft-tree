'use client';

import { useState } from 'react';
import { Item } from '@prisma/client';
import { Pencil1Icon, TrashIcon, CheckIcon, Cross2Icon } from '@radix-ui/react-icons';
import styles from './ItemCard.module.css';
import { updateItem } from '@/lib/items';

interface ItemCardProps
{
	item: Item;
	onDelete: (id: string) => void;
}

export default function ItemCard({ item, onDelete }: ItemCardProps)
{
	const [isEditing, setIsEditing] = useState(false);
	const [name, setName] = useState(item.name);
	const [loading, setLoading] = useState(false);

	async function handleSave()
	{
		setLoading(true);
		await updateItem({ data: { id: item.id, name } });
		setIsEditing(false);
		setLoading(false);
	}

	return (
		<div className={styles.card}>
			<input className={styles.input} value={name} onChange={(e) => setName(e.target.value)} readOnly={!isEditing} disabled={loading} />

			<div className={styles.actions}>
				{isEditing ? (
					<>
						<CheckIcon className={styles.icon} onClick={handleSave} />
						<Cross2Icon className={styles.icon} onClick={() => setIsEditing(false)} />
					</>
				) : (
					<>
						<Pencil1Icon className={styles.icon} onClick={() => setIsEditing(true)} />
						<TrashIcon className={styles.icon} onClick={() => onDelete(item.id)} />
					</>
				)}
			</div>
		</div>
	);
}
