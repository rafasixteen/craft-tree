'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Tag } from '@/domain/tag';
import { DataTableColumnHeader } from '../table/components/data-table-column-header';
import Link from 'next/link';
import { Button } from '../ui/button';
import { PackageIcon, PencilIcon, TrashIcon } from 'lucide-react';

export const tagColumnns: ColumnDef<Tag>[] = [
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
		id: 'actions',
		cell: ({ row }) =>
		{
			const id = row.original.id;
			const inventoryId = row.original.inventoryId;

			return (
				<div className="flex gap-2">
					<Button variant="default" size="icon-sm" asChild>
						<Link href={`/inventories/${inventoryId}/tags/${id}`}>
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
