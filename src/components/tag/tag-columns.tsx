'use client';

import { DataTableColumnHeader } from '@/components/data-table';

import { Button } from '@/components/ui/button';

import { Tag } from '@/domain/tag';

import Link from 'next/link';
import { PencilIcon } from 'lucide-react';
import { ColumnDef, Row } from '@tanstack/react-table';
import { DeleteTagDialog } from './delete-tag-dialog';
import { getTagHref } from '@/lib/navigation';

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
	return (
		<div className="flex justify-center gap-2">
			<Button variant="outline" size="icon-sm">
				<Link
					href={getTagHref({ inventoryId: row.original.inventoryId, tagId: row.original.id, path: ['edit'] })}
				>
					<PencilIcon className="size-3" />
				</Link>
			</Button>
			<DeleteTagDialog tag={row.original} />
		</div>
	);
}
