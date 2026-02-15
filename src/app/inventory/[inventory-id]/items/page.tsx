'use client';

import { Header } from '@/components/header';
import { CreateItemSheet, ItemGrid } from '@/components/item';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TagsCombobox } from '@/components/tag';
import { TagsDialog } from '@/components/tag';
import { UpdateItemSheet, useItemGrid } from '@/components/item';

export default function ItemsPage()
{
	const { editingItem, stopEditingItem } = useItemGrid();

	return (
		<>
			<Header>
				<CreateItemSheet />
				<Input placeholder="Search items..." type="search" className="max-w-52 min-w-32" />
				<TagsCombobox />
				<Button variant="secondary">Filter</Button>
				<Button variant="secondary">Clear Tags</Button>
				<TagsDialog trigger={<Button variant="ghost">Manage Tags</Button>} />
			</Header>
			<div className="flex flex-1 flex-col gap-4 p-4">
				<ItemGrid />
			</div>
			{editingItem && (
				<UpdateItemSheet
					item={editingItem}
					open={true}
					onOpenChange={(open) =>
					{
						if (!open) stopEditingItem();
					}}
				/>
			)}
		</>
	);
}
