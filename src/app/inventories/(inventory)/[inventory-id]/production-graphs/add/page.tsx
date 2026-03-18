'use client';

import { createProductionGraph } from '@/domain/production-graph';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/sidebar';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { useCurrentInventory } from '@/components/inventory';
import { toast } from 'sonner';
import { useCallback, useTransition } from 'react';
import {
	ProductionGraphForm,
	ProductionGraphFormValues,
	productionGraphFormSchema,
} from '@/components/production-graph';

export default function ProductionGraphAddPage()
{
	const router = useRouter();
	const inventory = useCurrentInventory();

	const [isCreating, startTransition] = useTransition();

	const form = useForm<ProductionGraphFormValues>({
		resolver: zodResolver(productionGraphFormSchema),
		mode: 'onChange',
		defaultValues: {
			name: '',
		},
	});

	const onSubmit = useCallback(
		async function onSubmit(values: ProductionGraphFormValues)
		{
			startTransition(async () =>
			{
				try
				{
					const { name } = values;

					await createProductionGraph({
						name: name,
						inventoryId: inventory.id,
					});

					toast.success(`Production graph '${name}' created`);
					form.reset();
				}
				catch
				{
					toast.error('Failed to create production graph');
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
					<CardTitle>Add Production Graph</CardTitle>
					<CardDescription>
						Add a new production graph to this inventory.
					</CardDescription>
				</CardHeader>
				<CardContent className="flex min-h-0 flex-1 flex-col">
					<ProductionGraphForm
						id="add-productionGraph-form"
						form={form}
						onSubmit={onSubmit}
					/>
				</CardContent>
				<CardFooter>
					<Field
						orientation="horizontal"
						className="flex w-full flex-row items-center justify-end gap-2"
					>
						<Button
							type="button"
							variant="secondary"
							onClick={() => router.back()}
							className="flex-1"
						>
							Cancel
						</Button>
						<Button
							type="submit"
							form="add-productionGraph-form"
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
