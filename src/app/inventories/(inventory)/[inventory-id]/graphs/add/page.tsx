'use client';

import { Header } from '@/components/sidebar';
import { useCurrentInventory } from '@/components/inventory';
import { GraphForm, GraphFormValues, graphFormSchema } from '@/components/graph';

import { Field } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import { createGraph } from '@/domain/graph';

import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useCallback, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { getGraphHref } from '@/lib/navigation';

export default function GraphAddPage()
{
	const router = useRouter();
	const inventory = useCurrentInventory();

	const [isCreating, startTransition] = useTransition();

	const form = useForm<GraphFormValues>({
		resolver: zodResolver(graphFormSchema),
		mode: 'onChange',
		defaultValues: {
			name: '',
		},
	});

	const onSubmit = useCallback(
		async function onSubmit(values: GraphFormValues)
		{
			startTransition(async () =>
			{
				try
				{
					const { name } = values;

					const graph = await createGraph({
						name: name,
						inventoryId: inventory.id,
					});

					toast.success(`Graph '${name}' created`);
					form.reset();

					router.push(
						getGraphHref({
							inventoryId: inventory.id,
							graphId: graph.id,
						}),
					);
				}
				catch (error)
				{
					console.error(error);
					toast.error('Failed to create graph');
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
					<CardTitle>Add Graph</CardTitle>
					<CardDescription>Add a new graph to this inventory.</CardDescription>
				</CardHeader>
				<CardContent className="flex min-h-0 flex-1 flex-col">
					<GraphForm id="add-graph-form" form={form} onSubmit={onSubmit} />
				</CardContent>
				<CardFooter>
					<Field orientation="horizontal" className="flex w-full flex-row items-center justify-end gap-2">
						<Button type="button" variant="secondary" onClick={() => router.back()} className="flex-1">
							Cancel
						</Button>
						<Button
							type="submit"
							form="add-graph-form"
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
