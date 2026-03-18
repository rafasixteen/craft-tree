'use client';

import { Header } from '@/components/sidebar';
import { InventoryForm, InventoryFormValues, inventoryFormSchema } from '@/components/inventory';

import { Field } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import { useInventory } from '@/domain/inventory';

import { toast } from 'sonner';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';

export default function InventoryEditPage()
{
	const router = useRouter();

	const params = useParams();
	const inventoryId = params['inventory-id'] as string;

	const { inventory, updateInventory } = useInventory(inventoryId);

	const form = useForm<InventoryFormValues>({
		resolver: zodResolver(inventoryFormSchema),
		mode: 'onChange',
		defaultValues: {
			name: inventory.name,
		},
	});

	const onSubmit = useCallback(
		async function onSubmit(values: InventoryFormValues)
		{
			try
			{
				const { name } = values;

				updateInventory({ name });

				toast.success(`Inventory '${name}' updated`);
				router.push(`/inventories/${inventory.id}/items`);
			}
			catch
			{
				toast.error('Failed to update inventory');
			}
		},
		[updateInventory, inventory.id, router],
	);

	return (
		<div className="flex h-screen flex-col">
			<Header />
			<Card className="flex min-h-0 flex-1 flex-col bg-transparent ring-0">
				<CardHeader>
					<CardTitle>Edit Inventory</CardTitle>
					<CardDescription>Edit an existing inventory.</CardDescription>
				</CardHeader>
				<CardContent className="flex min-h-0 flex-1 flex-col">
					<InventoryForm id="edit-inventory-form" form={form} onSubmit={onSubmit} />
				</CardContent>
				<CardFooter>
					<Field orientation="horizontal" className="flex w-full flex-row items-center justify-end gap-2">
						<Button type="button" variant="secondary" onClick={() => router.back()} className="flex-1">
							Cancel
						</Button>
						<Button
							type="submit"
							form="edit-inventory-form"
							disabled={!form.formState.isDirty || !form.formState.isValid}
							className="flex-1"
						>
							Save Changes
						</Button>
					</Field>
				</CardFooter>
			</Card>
		</div>
	);
}
