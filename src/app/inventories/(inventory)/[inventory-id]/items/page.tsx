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
import { Skeleton } from '@/components/ui/skeleton';

import { useItems, useTags } from '@/domain/inventory';
import { useItemsTags } from '@/domain/tag';

import Link from 'next/link';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { RefreshCw, TagsIcon } from 'lucide-react';

export default function ItemsPage()
{
	const inventory = useCurrentInventory();

	const {
		items,
		isLoading: areItemsLoading,
		isValidating: areItemsValidating,
	} = useItems({ inventoryId: inventory.id });

	const { tags, isLoading: areTagsLoading, isValidating: areTagsValidating } = useTags({ inventoryId: inventory.id });

	const {
		itemsTags,
		isLoading: areItemsTagsLoading,
		isValidating: areItemsTagsValidating,
	} = useItemsTags({ inventoryId: inventory.id });

	const tagsOptions = tags?.map((tag) => ({
		label: tag.name,
		value: tag.name,
	}));

	const isLoading = areItemsLoading || areTagsLoading || areItemsTagsLoading;
	const isValidating = areItemsValidating || areTagsValidating || areItemsTagsValidating;

	const tableData = useMemo(() =>
	{
		if (isLoading || !items || !tags || !itemsTags)
		{
			return Array(32).fill({});
		}

		return items.map((item) => ({
			...item,
			tags: itemsTags
				.filter((itemTag) => itemTag.itemId === item.id)
				.map((itemTag) => tags.find((tag) => tag.id === itemTag.tagId)?.name),
		}));
	}, [isLoading, items, itemsTags, tags]);

	const tableColumns = useMemo(() =>
	{
		if (isLoading)
		{
			return itemColumnns.map((col, index) => ({
				...col,
				cell: () => (
					<div className={cn('flex', index === itemColumnns.length - 1 && 'justify-center')}>
						<Skeleton className="h-4 w-32" />
					</div>
				),
			}));
		}

		return itemColumnns;
	}, [isLoading]);

	const table = useDataTable({
		columns: tableColumns,
		data: tableData,
	});

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
						options={tagsOptions ?? []}
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
			<div className="relative">
				{isValidating && !isLoading && (
					<div className="absolute -top-16 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-lg border bg-background px-3 py-1.5 text-sm shadow-md">
						<RefreshCw className="size-3.5 animate-spin text-muted-foreground" />
						<span className="text-muted-foreground">Syncing items...</span>
					</div>
				)}
				<DataTablePagination table={table} />
			</div>
		</>
	);
}
