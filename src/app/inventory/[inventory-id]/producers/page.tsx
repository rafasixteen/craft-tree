'use client';

import { Header } from '@/components/craft-tree-sidebar';
import { ProducerGrid } from '@/components/producer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ProducersPage()
{
	return (
		<>
			<Header>
				<Button asChild variant="default">
					<Link href="producers/add">Add Producer</Link>
				</Button>
			</Header>
			<div className="flex flex-1 flex-col gap-4 p-4">
				<ProducerGrid />
			</div>
		</>
	);
}
