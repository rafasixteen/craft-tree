'use client';

import Link from 'next/link';
import { useInventories } from '@/domain/inventory';

export default function InventoryRootPage()
{
	const { inventories } = useInventories();

	if (inventories.length > 0)
	{
		// TODO: Redirect either to /items or /producers based on the last visited page for that inventory.
		return inventories.map((inventory) => (
			<div key={inventory.id} className="flex flex-1 flex-col gap-4 p-4">
				<Link
					href={`/inventories/${inventory.id}/items`}
					className="inline-flex items-center rounded-md border border-input bg-background px-4 py-2 text-base font-medium shadow-sm transition-colors hover:bg-accent focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none"
				>
					{inventory.name}
				</Link>
			</div>
		));
	}
	else
	{
		return (
			<div className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
				<p className="text-sm text-muted-foreground">No inventories found. Create one to get started!</p>
			</div>
		);
	}
}
