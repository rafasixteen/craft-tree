'use client';

import { Header } from '@/components/craft-tree-sidebar';
import { tagColumnns } from '@/components/tag';
import { useTags } from '@/domain/tag';
import { useInventory } from '@/components/inventory';
import { DataTable } from '@/components/table/components/data-table';

export default function TagsPage()
{
	const inventory = useInventory();

	const { tags } = useTags({ inventoryId: inventory.id });

	return (
		<>
			<Header></Header>
			<DataTable data={tags} columns={tagColumnns} />
		</>
	);
}
