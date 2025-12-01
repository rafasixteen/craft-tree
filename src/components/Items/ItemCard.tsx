'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Item } from '@/graphql/generated/graphql';
import { Pencil1Icon, TrashIcon, CheckIcon, Cross2Icon } from '@radix-ui/react-icons';
import styles from './ItemCard.module.css';

interface ItemCardProps
{
	item: Item;
	isEditing: boolean;
	onDelete: (id: string) => void;
	setEditing: (id: string | null) => void;
	saveItem: (item: Item) => void;
	cancelEdit: (item: Item) => void;
}

export default function ItemCard({ item, isEditing, onDelete, setEditing, saveItem, cancelEdit }: ItemCardProps)
{
	const [name, setName] = useState(item.name);
	const inputRef = useRef<HTMLInputElement>(null);

	const router = useRouter();
	const searchParams = useSearchParams();

	function handleSelect()
	{
		if (isEditing) return;

		const params = new URLSearchParams(searchParams.toString());
		params.set('selectedItemId', item.id);

		router.push(`?${params.toString()}`);
	}

	useEffect(() =>
	{
		if (isEditing)
		{
			inputRef.current?.focus();
		}
		else
		{
			setName(item.name);
		}
	}, [isEditing, item.name]);

	function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>)
	{
		if (!isEditing) return;

		if (e.key === 'Enter')
		{
			if (name.trim() !== '')
			{
				saveItem({ ...item, name: name.trim() });
			}
		}
		else if (e.key === 'Escape')
		{
			cancelEdit(item);
		}
	}

	return (
		<div className={styles.card} onClick={handleSelect}>
			<input ref={inputRef} className={styles.input} value={name} onChange={(e) => setName(e.target.value)} readOnly={!isEditing} onKeyDown={handleKeyDown} placeholder="New Item" />

			<div className={styles.actions}>
				{isEditing ? (
					<>
						<CheckIcon className={styles.icon} onClick={() => saveItem({ ...item, name: name.trim() })} />
						<Cross2Icon className={styles.icon} onClick={() => cancelEdit(item)} />
					</>
				) : (
					<>
						<Pencil1Icon className={styles.icon} onClick={() => setEditing(item.id)} />
						<TrashIcon className={styles.icon} onClick={() => onDelete(item.id)} />
					</>
				)}
			</div>
		</div>
	);
}
