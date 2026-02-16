'use client';

import { Header } from '@/components/header';
import { CreateItemSheet, ItemGrid } from '@/components/item';
import { UpdateItemSheet, useItemGrid } from '@/components/item';

export default function ItemsPage()
{
	const { editingItem, stopEditingItem } = useItemGrid();

	return (
		<>
			<Header>
				<CreateItemSheet />
			</Header>
			<div className="flex flex-1 flex-col gap-4 p-4">
				<ItemGrid />
			</div>
			{editingItem && <UpdateItemSheet item={editingItem} open={true} onOpenChange={(open) => !open && stopEditingItem()} />}
		</>
	);
}
