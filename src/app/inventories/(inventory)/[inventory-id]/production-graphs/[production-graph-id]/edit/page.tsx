'use client';

import { Header } from '@/components/sidebar';
import {
	ProductionGraphForm,
	ProductionGraphFormValues,
	productionGraphFormSchema,
} from '@/components/production-graph';

import { Field } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import { useProductionGraph } from '@/domain/production-graph';

import { toast } from 'sonner';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';

export default function ProductionGraphEditPage()
{
	const router = useRouter();
	const params = useParams();

	const productionGraphId = params['production-graph-id'] as string;

	const { productionGraph, updateProductionGraph } = useProductionGraph(productionGraphId);

	const form = useForm<ProductionGraphFormValues>({
		resolver: zodResolver(productionGraphFormSchema),
		mode: 'onChange',
		defaultValues: {
			name: productionGraph.name,
		},
	});

	const onSubmit = useCallback(
		async function onSubmit(values: ProductionGraphFormValues)
		{
			try
			{
				const { name } = values;

				updateProductionGraph({ name });

				toast.success(`Production graph '${name}' updated`);
				router.push(`/inventories/${productionGraph.inventoryId}/production-graphs`);
			}
			catch
			{
				toast.error('Failed to update production graph');
			}
		},
		[updateProductionGraph, productionGraph.inventoryId, router],
	);

	return (
		<div className="flex h-screen flex-col">
			<Header />
			<Card className="flex min-h-0 flex-1 flex-col bg-transparent ring-0">
				<CardHeader>
					<CardTitle>Edit Production Graph</CardTitle>
					<CardDescription>Edit an existing production graph.</CardDescription>
				</CardHeader>
				<CardContent className="flex min-h-0 flex-1 flex-col">
					<ProductionGraphForm id="edit-production-graph-form" form={form} onSubmit={onSubmit} />
				</CardContent>
				<CardFooter>
					<Field orientation="horizontal" className="flex w-full flex-row items-center justify-end gap-2">
						<Button type="button" variant="secondary" onClick={() => router.back()} className="flex-1">
							Cancel
						</Button>
						<Button
							type="submit"
							form="edit-production-graph-form"
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
