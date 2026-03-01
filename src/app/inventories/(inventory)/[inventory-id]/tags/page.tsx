'use client';

import { Header } from '@/components/craft-tree-sidebar';
import { tagColumnns } from '@/components/tag';
import { useMemo } from 'react';
import { useTags } from '@/domain/tag';
import { useCurrentInventory } from '@/components/inventory';
import { useDataTable, DataTablePagination, DataTableFilter, DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function TagsPage()
{
	const inventory = useCurrentInventory();

	const { tags } = useTags({ inventoryId: inventory.id });

	const tableData = useMemo(
		() =>
			tags.map((tag) => ({
				...tag,
			})),
		[tags, tags],
	);

	const table = useDataTable({
		columns: tagColumnns,
		data: tableData,
	});

	return (
		<>
			<Header>
				<div className="flex items-center space-x-2">
					<DataTableFilter table={table} filterKey="name" type="search" placeholder="Filter tags..." className="h-8 w-64" />
					<Button variant="default" size="sm" className="h-8">
						<Link href={`/inventories/${inventory.id}/tags/add`}>Add Tag</Link>
					</Button>
				</div>
			</Header>
			<Card className="m-2 flex-1 bg-transparent p-0">
				<DataTable table={table} />
			</Card>
			<DataTablePagination table={table} />
		</>
	);
}
