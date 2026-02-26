'use client';

import { useItemTags } from '@/domain/item';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/craft-tree-sidebar';
import { useItem } from '@/domain/item';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { toast } from 'sonner';
import { useCallback } from 'react';
import { ItemForm, ItemFormValues, itemFormSchema } from '@/components/item';

export default function ItemEditPage()
{
	const router = useRouter();

	const params = useParams();
	const itemId = params['item-id'] as string;

	const { item, updateItem } = useItem(itemId);
	const { tags, setTags } = useItemTags(itemId);

	const form = useForm<ItemFormValues>({
		resolver: zodResolver(itemFormSchema),
		defaultValues: {
			name: item.name,
			tagIds: tags.map((tag) => tag.tagId),
		},
	});

	const onSubmit = useCallback(
		async function onSubmit(values: ItemFormValues)
		{
			try
			{
				const { name, tagIds } = values;

				updateItem({ name, icon: null });
				setTags({ tagIds });

				toast.success(`Item '${name}' updated`);

				router.push(`/inventories/${item.inventoryId}/items`);
			}
			catch
			{
				toast.error('Failed to update item');
			}
		},
		[updateItem, setTags, item.inventoryId, router],
	);

	return (
		<div className="flex h-screen flex-col">
			<Header />
			<Card className="flex min-h-0 flex-1 flex-col bg-transparent ring-0">
				<CardHeader>
					<CardTitle>Edit Item</CardTitle>
					<CardDescription>Edit an existing item.</CardDescription>
				</CardHeader>
				<CardContent className="flex min-h-0 flex-1 flex-col">
					<ItemForm id="edit-item-form" form={form} onSubmit={onSubmit} />
				</CardContent>
				<CardFooter>
					<Field orientation="horizontal" className="flex w-full flex-row items-center justify-end gap-2">
						<Button type="button" variant="secondary" onClick={() => router.back()} className="flex-1">
							Cancel
						</Button>
						<Button type="submit" form="edit-item-form" disabled={!form.formState.isDirty} className="flex-1">
							Save Changes
						</Button>
					</Field>
				</CardFooter>
			</Card>
		</div>
	);
}
