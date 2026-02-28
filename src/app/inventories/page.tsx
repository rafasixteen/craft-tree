'use client';

import { useInventories } from '@/domain/inventory';
import { DataTable, DataTableFilter, useDataTable } from '@/components/data-table';
import { inventoryColumnns } from '@/components/inventory';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Header, InventoriesSidebar } from '@/components/craft-tree-sidebar';
import Link from 'next/link';

export default function InventoriesPage()
{
	const { inventories } = useInventories();

	const table = useDataTable({
		data: inventories,
		columns: inventoryColumnns,
	});

	const sidebarState = document.cookie.includes('sidebar_state=true');

	return (
		<SidebarProvider defaultOpen={sidebarState}>
			<InventoriesSidebar />
			<SidebarInset>
				<div className="flex h-full flex-col">
					<Header>
						<div className="flex items-center space-x-2">
							<DataTableFilter table={table} filterKey="name" type="search" placeholder="Filter inventories..." className="h-8 w-64" />
							<Button variant="default" size="sm" className="h-8">
								<Link href="/inventories/create">Create Inventory</Link>
							</Button>
						</div>
					</Header>
					<Card className="m-2 flex-1 bg-transparent p-0">
						<DataTable table={table} />
					</Card>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
