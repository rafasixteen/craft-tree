'use client';

import { Header } from '@/components/sidebar';
import { useCurrentInventory } from '@/components/inventory';
import { ItemForm, ItemFormValues, itemFormSchema } from '@/components/item';

import { Field } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import { createItem, setItemTags } from '@/domain/item';

import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useCallback, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

export default function ItemAddPage()
{
	const router = useRouter();
	const inventory = useCurrentInventory();

	const [isCreating, startTransition] = useTransition();

	const form = useForm<ItemFormValues>({
		resolver: zodResolver(itemFormSchema),
		mode: 'onChange',
		defaultValues: {
			name: '',
			tagIds: [],
		},
	});

	const onSubmit = useCallback(
		async function onSubmit(values: ItemFormValues)
		{
			startTransition(async () =>
			{
				try
				{
					const { name, tagIds } = values;

					const item = await createItem({
						name: name,
						inventoryId: inventory.id,
					});

					await setItemTags({
						itemId: item.id,
						tagIds: tagIds,
					});

					toast.success(`Item '${name}' created`);

					form.reset({
						tagIds: tagIds,
					});
				}
				catch
				{
					toast.error('Failed to create item');
				}
			});
		},
		[inventory.id, form, router],
	);

	return (
		<div className="flex h-screen flex-col">
			<Header />
			<Card className="flex min-h-0 flex-1 flex-col bg-transparent ring-0">
				<CardHeader>
					<CardTitle>Add Item</CardTitle>
					<CardDescription>Add a new item to this inventory.</CardDescription>
				</CardHeader>
				<CardContent className="flex min-h-0 flex-1 flex-col">
					<ItemForm id="add-item-form" form={form} onSubmit={onSubmit} />
				</CardContent>
				<CardFooter>
					<Field orientation="horizontal" className="flex w-full flex-row items-center justify-end gap-2">
						<Button type="button" variant="secondary" onClick={() => router.back()} className="flex-1">
							Cancel
						</Button>
						<Button
							type="submit"
							form="add-item-form"
							disabled={isCreating || !form.formState.isValid}
							className="flex-1"
						>
							{isCreating ? 'Creating...' : 'Create'}
						</Button>
					</Field>
				</CardFooter>
			</Card>
		</div>
	);
}
