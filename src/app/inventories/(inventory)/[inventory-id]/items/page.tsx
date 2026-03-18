'use client';

import { Header } from '@/components/sidebar';
import { itemColumnns } from '@/components/item';
import { useCurrentInventory } from '@/components/inventory';
import {
	DataTable,
	DataTableFacetedFilter,
	DataTableFilter,
	DataTablePagination,
	useDataTable,
} from '@/components/data-table';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { useItems } from '@/domain/item';
import { useItemsTags, useTags } from '@/domain/tag';

import Link from 'next/link';
import { useMemo } from 'react';
import { TagsIcon } from 'lucide-react';

export default function ItemsPage()
{
	const inventory = useCurrentInventory();

	const { items } = useItems({ inventoryId: inventory.id });

	const { tags } = useTags({ inventoryId: inventory.id });
	const itemsTags = useItemsTags({ inventoryId: inventory.id });

	const tableData = useMemo(
		() =>
			items.map((item) => ({
				...item,
				tags: itemsTags
					.filter((itemTag) => itemTag.itemId === item.id)
					.map((itemTag) => tags.find((tag) => tag.id === itemTag.tagId)?.name || ''),
			})),
		[items, itemsTags, tags],
	);

	const table = useDataTable({
		columns: itemColumnns,
		data: tableData,
	});

	const tagsOptions = tags.map((tag) => ({
		label: tag.name,
		value: tag.name,
	}));

	return (
		<>
			<Header>
				<div className="flex items-center space-x-2">
					<DataTableFilter
						table={table}
						filterKey="name"
						type="search"
						placeholder="Filter items..."
						className="h-8 w-64"
					/>
					<DataTableFacetedFilter
						column={table.getColumn('tags')}
						title="Tags"
						options={tagsOptions}
						trigger={
							<Button variant="secondary" size="icon-lg" className="h-8">
								<TagsIcon className="size-3" />
							</Button>
						}
					/>
					<Button variant="default" size="sm" className="h-8">
						<Link href={`/inventories/${inventory.id}/items/add`}>Add Item</Link>
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
