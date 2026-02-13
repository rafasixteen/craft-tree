'use client';

import { Header } from '@/components/header';
import { ItemGrid } from '@/components/inventory/item-grid';
import { Button } from '@/components/ui/button';
import { AddItemDialog } from '@/components/item/add-item-dialog';
import { Input } from '@/components/ui/input';
import { TagsCombobox } from '@/components/tags/tags-combo-box';
import { TagsDialog } from '@/components/tags';
import { ItemSelectionProvider } from '@/components/inventory';

export default function ItemsPage()
{
	return (
		<ItemSelectionProvider>
			<Header>
				<AddItemDialog trigger={<Button variant="ghost">Add Item</Button>} />
				<Input placeholder="Search items..." type="search" className="max-w-52 min-w-32" />
				<TagsCombobox />
				<Button variant="secondary">Filter</Button>
				<Button variant="secondary">Clear Tags</Button>
				<TagsDialog trigger={<Button variant="ghost">Manage Tags</Button>} />
			</Header>
			<div className="flex flex-1 flex-col gap-4 p-4">
				<ItemGrid />
			</div>
		</ItemSelectionProvider>
	);
}
