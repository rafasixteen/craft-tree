'use client';

import { Header } from '@/components/sidebar';
import { GraphForm, GraphFormValues, graphFormSchema } from '@/components/graph';

import { Field } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import { updateGraph, useGraph } from '@/domain/graph';

import { toast } from 'sonner';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';

export default function GraphEditPage()
{
	const router = useRouter();
	const params = useParams();

	const graphId = params['graph-id'] as string;

	const { graph } = useGraph({ graphId });

	if (!graph)
	{
		// TODO: Improve this error message.
		throw new Error('Graph is null.');
	}

	const form = useForm<GraphFormValues>({
		resolver: zodResolver(graphFormSchema),
		mode: 'onChange',
		defaultValues: {
			name: graph.name,
		},
	});

	const onSubmit = useCallback(
		async function onSubmit(values: GraphFormValues)
		{
			try
			{
				const { name } = values;

				updateGraph({
					id: graph.id,
					name: name,
				});

				toast.success(`Graph '${name}' updated`);
				router.push(`/inventories/${graph.inventoryId}/graphs`);
			}
			catch
			{
				toast.error('Failed to update graph');
			}
		},
		[updateGraph, graph, router],
	);

	return (
		<div className="flex h-screen flex-col">
			<Header />
			<Card className="flex min-h-0 flex-1 flex-col bg-transparent ring-0">
				<CardHeader>
					<CardTitle>Edit Graph</CardTitle>
					<CardDescription>Edit an existing graph.</CardDescription>
				</CardHeader>
				<CardContent className="flex min-h-0 flex-1 flex-col">
					<GraphForm id="edit-graph-form" form={form} onSubmit={onSubmit} />
				</CardContent>
				<CardFooter>
					<Field orientation="horizontal" className="flex w-full flex-row items-center justify-end gap-2">
						<Button type="button" variant="secondary" onClick={() => router.back()} className="flex-1">
							Cancel
						</Button>
						<Button
							type="submit"
							form="edit-graph-form"
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
