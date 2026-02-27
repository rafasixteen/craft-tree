'use client';

import { Header } from '@/components/craft-tree-sidebar';
import { itemColumnns } from '@/components/item';
import { useItems } from '@/domain/item';
import { useInventory } from '@/components/inventory';
import { DataTable } from '@/components/table/components/data-table';

export default function ItemsPage()
{
	const inventory = useInventory();

	const { items } = useItems({ inventoryId: inventory.id });

	const tableData = items.map((item) => ({
		...item,
		tags: ['tag1', 'tag2'],
	}));

	return (
		<>
			<Header></Header>
			<DataTable data={tableData} columns={itemColumnns} />
		</>
	);
}
