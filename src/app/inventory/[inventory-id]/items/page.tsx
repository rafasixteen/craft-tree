'use client';

import { Header } from '@/components/craft-tree-sidebar/header';
import { ItemGrid } from '@/components/item';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ItemsPage()
{
	return (
		<>
			<Header>
				<Button asChild variant="default">
					<Link href="items/add">Add Item</Link>
				</Button>
			</Header>
			<div className="flex flex-1 flex-col gap-4 p-4">
				<ItemGrid />
			</div>
		</>
	);
}
