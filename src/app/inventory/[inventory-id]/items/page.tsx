'use client';

import { Header } from '@/components/header';
import { CreateItemSheet, ItemGrid } from '@/components/item';
import { UpdateItemSheet } from '@/components/item';
import { useGrid } from '@/components/grid';
import { Item } from '@/domain/item';

export default function ItemsPage()
{
	const { editingCell, stopEditingCell } = useGrid<Item>();

	return (
		<>
			<Header>
				<CreateItemSheet />
			</Header>
			<div className="flex flex-1 flex-col gap-4 p-4">
				<ItemGrid />
			</div>
			{editingCell && <UpdateItemSheet item={editingCell} open={true} onOpenChange={(open) => !open && stopEditingCell()} />}
		</>
	);
}
