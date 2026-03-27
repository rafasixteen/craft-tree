'use client';

import { Header } from '@/components/sidebar';
import { producerColumnns } from '@/components/producer';
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

import { useProducers, useTags } from '@/domain/inventory';
import { useProducersTags } from '@/domain/tag';

import Link from 'next/link';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { RefreshCw, TagsIcon } from 'lucide-react';

export default function ProducersPage()
{
	const inventory = useCurrentInventory();

	const {
		producers,
		isLoading: areProducersLoading,
		isValidating: areProducersValidating,
	} = useProducers({ inventoryId: inventory.id });

	const { tags, isLoading: areTagsLoading, isValidating: areTagsValidating } = useTags({ inventoryId: inventory.id });

	const {
		producersTags,
		isLoading: areProducersTagsLoading,
		isValidating: areProducersTagsValidating,
	} = useProducersTags({ inventoryId: inventory.id });

	const tagsOptions = tags?.map((tag) => ({
		label: tag.name,
		value: tag.name,
	}));

	const isLoading = areProducersLoading || areTagsLoading || areProducersTagsLoading;
	const isValidating = areProducersValidating || areTagsValidating || areProducersTagsValidating;

	const tableData = useMemo(() =>
	{
		if (isLoading || !producers || !tags || !producersTags)
		{
			return Array(32).fill({});
		}

		return producers.map((producer) => ({
			...producer,
			tags: producersTags
				.filter((producerTag) => producerTag.producerId === producer.id)
				.map((producerTag) => tags.find((tag) => tag.id === producerTag.tagId)?.name),
		}));
	}, [isLoading, producers, producersTags, tags]);

	const tableColumns = useMemo(() =>
	{
		if (isLoading)
		{
			return producerColumnns.map((col, index) => ({
				...col,
				cell: () => (
					<div
						className={cn(
							'flex',
							index === producerColumnns.length - 1 ? 'justify-center' : 'justify-start',
						)}
					>
						<Skeleton className="h-4 w-32" />
					</div>
				),
			}));
		}

		return producerColumnns;
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
						placeholder="Filter producers..."
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
						<Link href={`/inventories/${inventory.id}/producers/add`}>Add Producer</Link>
					</Button>
				</div>
			</Header>
			<Card className="m-2 flex-1 bg-transparent p-0">
				<DataTable table={table} />
			</Card>
			<div className="relative">
				{isValidating && !isLoading && (
					<div className="absolute -top-16 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-lg border bg-background px-3 py-1.5 text-sm shadow-md">
						<RefreshCw className="size-3.5 animate-spin text-muted-foreground" />
						<span className="text-muted-foreground">Syncing producers...</span>
					</div>
				)}
				<DataTablePagination table={table} />
			</div>
		</>
	);
}
