'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Producer } from '@/domain/producer';
import { DataTableColumnHeader } from '../table/components/data-table-column-header';
import Link from 'next/link';
import { Button } from '../ui/button';
import { PackageIcon, PencilIcon, TrashIcon } from 'lucide-react';

export type ProducerColumnData = Producer & { tags: string[] };

export const producerColumnns: ColumnDef<ProducerColumnData>[] = [
	{
		accessorKey: 'name',
		header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
		cell: ({ row }) =>
		{
			return (
				<div className="flex space-x-2">
					<span className="max-w-[500px] truncate font-medium">{row.getValue('name')}</span>
				</div>
			);
		},
	},
	{
		accessorKey: 'tags',
		header: ({ column }) => <DataTableColumnHeader column={column} title="Tags" />,
		cell: ({ row }) =>
		{
			const tags = row.getValue('tags') as string[];

			return (
				<div className="flex flex-wrap gap-1">
					{tags && tags.length > 0 ? (
						tags.map((tag, idx) => (
							<span key={idx} className="px-2 py-1 bg-muted rounded text-xs">
								{tag}
							</span>
						))
					) : (
						<span className="text-gray-400">No tags</span>
					)}
				</div>
			);
		},
		enableSorting: false,
	},
	{
		id: 'actions',
		cell: ({ row }) =>
		{
			const id = row.original.id;
			const inventoryId = row.original.inventoryId;

			return (
				<div className="flex gap-2">
					<Button variant="default" size="icon-sm" asChild>
						<Link href={`/inventories/${inventoryId}/producers/${id}`}>
							<PackageIcon className="size-3" />
						</Link>
					</Button>
					<Button variant="outline" size="icon-sm">
						<PencilIcon className="size-3" />
					</Button>
					<Button variant="destructive" size="icon-sm">
						<TrashIcon className="size-3" />
					</Button>
				</div>
			);
		},
		enableSorting: false,
		enableHiding: false,
	},
];
