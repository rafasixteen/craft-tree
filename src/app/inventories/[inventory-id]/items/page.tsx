'use client';

import { Header } from '@/components/craft-tree-sidebar';
import { itemColumnns, ItemsTable } from '@/components/item';
import { useItems } from '@/domain/item';
import { useInventory } from '@/components/inventory';
import { useTable, DataTableToolbar, DataTablePagination } from '@/components/table';

export default function ItemsPage()
{
	const inventory = useInventory();

	const { items } = useItems({ inventoryId: inventory.id });

	const tableData = items.map((item) => ({
		...item,
		tags: ['tag1', 'tag2'],
	}));

	const table = useTable({
		columns: itemColumnns,
		data: tableData,
	});

	return (
		<>
			<Header>{/* <DataTableToolbar table={table} /> */}</Header>
			<ItemsTable table={table} />
			{/* <DataTablePagination table={table} /> */}
		</>
	);
}
