'use client';

import { ColumnDef, Row } from '@tanstack/react-table';
import { Tag, useTags } from '@/domain/tag';
import { DataTableColumnHeader } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { PencilIcon, TrashIcon } from 'lucide-react';
import Link from 'next/link';

export type TagColumnData = Tag;

export const tagColumnns: ColumnDef<TagColumnData>[] = [
	{
		accessorKey: 'name',
		header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
		cell: ({ row }) =>
		{
			const name = row.original.name;
			const href = `/inventories/${row.original.inventoryId}/tags/${row.original.id}`;

			return (
				<Link href={href} className="ml-3 truncate font-medium hover:underline">
					{name}
				</Link>
			);
		},
	},
	{
		id: 'actions',
		header: ({ column }) => <DataTableColumnHeader column={column} title="Actions" className="text-center" />,
		cell: ({ row }) => <Actions row={row} />,
		enableSorting: false,
		enableHiding: false,
	},
];

interface ActionsProps
{
	row: Row<TagColumnData>;
}

function Actions({ row }: ActionsProps)
{
	const id = row.original.id;
	const inventoryId = row.original.inventoryId;

	const { deleteTag } = useTags({ inventoryId });

	return (
		<div className="flex justify-center gap-2">
			<Button variant="outline" size="icon-sm">
				<Link href={`/inventories/${inventoryId}/tags/${id}/edit`}>
					<PencilIcon className="size-3" />
				</Link>
			</Button>
			<Button variant="destructive" size="icon-sm" onClick={() => deleteTag(id)}>
				<TrashIcon className="size-3" />
			</Button>
		</div>
	);
}
