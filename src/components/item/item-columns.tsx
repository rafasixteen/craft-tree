'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Item } from '@/domain/item';
import { DataTableColumnHeader } from '../table/components/data-table-column-header';
import Link from 'next/link';
import { Button } from '../ui/button';
import { PackageIcon, PencilIcon, TrashIcon } from 'lucide-react';

export type ItemColumnData = Item & { tags: string[] };

export const itemColumnns: ColumnDef<ItemColumnData>[] = [
	{
		accessorKey: 'name',
		header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
		cell: ({ row }) =>
		{
			const name = row.original.name;

			return (
				<div className="flex space-x-2">
					<span className="max-w-[500px] truncate font-medium">{name}</span>
				</div>
			);
		},
	},
	{
		accessorKey: 'tags',
		header: ({ column }) => <DataTableColumnHeader column={column} title="Tags" />,
		cell: ({ row }) =>
		{
			const tags = row.original.tags;

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
						<Link href={`/inventories/${inventoryId}/items/${id}`}>
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
