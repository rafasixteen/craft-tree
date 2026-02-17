'use client';

import { Header } from '@/components/craft-tree-sidebar/header';
import { CreateProducerSheet, ProducerGrid } from '@/components/producer';
import { UpdateProducerSheet } from '@/components/producer';
import { useGrid } from '@/components/grid';
import { Producer } from '@/domain/producer';

export default function ProducersPage()
{
	const { editingCell, stopEditingCell } = useGrid<Producer>();

	return (
		<>
			<Header>
				<CreateProducerSheet />
			</Header>
			<div className="flex flex-1 flex-col gap-4 p-4">
				<ProducerGrid />
			</div>
			{editingCell && <UpdateProducerSheet producer={editingCell} open={true} onOpenChange={(open) => !open && stopEditingCell()} />}
		</>
	);
}
