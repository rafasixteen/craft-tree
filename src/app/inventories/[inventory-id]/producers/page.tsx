'use client';

import { Header } from '@/components/craft-tree-sidebar';
import { producerColumnns } from '@/components/producer';
import { useProducers } from '@/domain/producer';
import { useInventory } from '@/components/inventory';
import { DataTable } from '@/components/table/components/data-table';

export default function ProducersPage()
{
	const inventory = useInventory();

	const { producers } = useProducers({ inventoryId: inventory.id });

	const tableData = producers.map((producer) => ({
		...producer,
		tags: ['tag1', 'tag2'],
	}));

	return (
		<>
			<Header></Header>
			<DataTable data={tableData} columns={producerColumnns} />
		</>
	);
}
