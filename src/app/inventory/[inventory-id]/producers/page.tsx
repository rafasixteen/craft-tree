'use client';

import { Header } from '@/components/header';
import { CreateProducerSheet, ProducerGrid } from '@/components/producer';
import { UpdateProducerSheet } from '@/components/producer';
import { useItemGridGeneric } from '@/components/grid';
import { Producer } from '@/domain/producer';

export default function ProducersPage()
{
	const { editingItem, stopEditingItem } = useItemGridGeneric<Producer>();

	return (
		<>
			<Header>
				<CreateProducerSheet />
			</Header>
			<div className="flex flex-1 flex-col gap-4 p-4">
				<ProducerGrid />
			</div>
			{editingItem && <UpdateProducerSheet producer={editingItem} open={true} onOpenChange={(open) => !open && stopEditingItem()} />}
		</>
	);
}
