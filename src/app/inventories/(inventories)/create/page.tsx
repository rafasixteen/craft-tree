'use client';

import { createInventory } from '@/domain/inventory';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/craft-tree-sidebar';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { toast } from 'sonner';
import { useCallback, useTransition } from 'react';
import { InventoryForm, InventoryFormValues, inventoryFormSchema } from '@/components/inventory';
import { useUser } from '@/domain/user';

export default function InventoryAddPage()
{
	const router = useRouter();

	const user = useUser();
	const userId = user?.id ?? null;

	const [isCreating, startTransition] = useTransition();

	const form = useForm<InventoryFormValues>({
		resolver: zodResolver(inventoryFormSchema),
		mode: 'onChange',
		defaultValues: {
			name: '',
		},
	});

	const onSubmit = useCallback(
		async function onSubmit(values: InventoryFormValues)
		{
			if (!userId)
			{
				toast.error('User not found');
				return;
			}

			startTransition(async () =>
			{
				try
				{
					const { name } = values;

					await createInventory({
						name: name,
						userId: userId,
					});

					toast.success(`Inventory '${name}' created`);
					form.reset();
				}
				catch
				{
					toast.error('Failed to create inventory');
				}
			});
		},
		[userId, form, router],
	);

	return (
		<div className="flex h-screen flex-col">
			<Header />
			<Card className="flex min-h-0 flex-1 flex-col bg-transparent ring-0">
				<CardHeader>
					<CardTitle>Create Inventory</CardTitle>
					<CardDescription>Add a new inventory to your account.</CardDescription>
				</CardHeader>
				<CardContent className="flex min-h-0 flex-1 flex-col">
					<InventoryForm id="add-inventory-form" form={form} onSubmit={onSubmit} />
				</CardContent>
				<CardFooter>
					<Field orientation="horizontal" className="flex w-full flex-row items-center justify-end gap-2">
						<Button type="button" variant="secondary" onClick={() => router.back()} className="flex-1">
							Cancel
						</Button>
						<Button type="submit" form="add-inventory-form" disabled={isCreating || !form.formState.isValid} className="flex-1">
							{isCreating ? 'Creating...' : 'Create'}
						</Button>
					</Field>
				</CardFooter>
			</Card>
		</div>
	);
}
