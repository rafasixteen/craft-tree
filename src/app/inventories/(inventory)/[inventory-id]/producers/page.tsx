'use client';

import { Header } from '@/components/craft-tree-sidebar';
import { producerColumnns } from '@/components/producer';
import { useMemo } from 'react';
import { useProducers } from '@/domain/producer';
import { useCurrentInventory } from '@/components/inventory';
import { useDataTable, DataTablePagination, DataTableFilter, DataTableFacetedFilter, DataTable } from '@/components/data-table';
import { useProducersTags, useTags } from '@/domain/tag';
import { Button } from '@/components/ui/button';
import { TagsIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function ProducersPage()
{
	const inventory = useCurrentInventory();

	const { producers } = useProducers({ inventoryId: inventory.id });

	const { tags } = useTags({ inventoryId: inventory.id });
	const producersTags = useProducersTags({ inventoryId: inventory.id });

	const tableData = useMemo(
		() =>
			producers.map((producer) => ({
				...producer,
				tags: producersTags
					.filter((producerTag) => producerTag.producerId === producer.id)
					.map((producerTag) => tags.find((tag) => tag.id === producerTag.tagId)?.name || ''),
			})),
		[producers, producersTags, tags],
	);

	const table = useDataTable({
		columns: producerColumnns,
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
					<DataTableFilter table={table} filterKey="name" type="search" placeholder="Filter producers..." className="h-8 w-64" />
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
						<Link href={`/inventories/${inventory.id}/producers/add`}>Add Producer</Link>
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
