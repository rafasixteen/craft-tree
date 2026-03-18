'use client';

import { Header } from '@/components/sidebar';
import { useCurrentInventory } from '@/components/inventory';
import { ProducerForm, ProducerFormValues, producerFormSchema } from '@/components/producer';

import { Field } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import { createProducer, setProducerInputs, setProducerOutputs, setProducerTags } from '@/domain/producer';

import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useCallback, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

export default function ProducerAddPage()
{
	const router = useRouter();
	const inventory = useCurrentInventory();

	const [isCreating, startTransition] = useTransition();

	const form = useForm<ProducerFormValues>({
		resolver: zodResolver(producerFormSchema),
		mode: 'onChange',
		defaultValues: {
			name: '',
			time: 10,
			tagIds: [],
			inputs: [],
			outputs: [],
		},
	});

	const onSubmit = useCallback(
		async function onSubmit(values: ProducerFormValues)
		{
			startTransition(async () =>
			{
				try
				{
					const { name, time, tagIds, inputs, outputs } = values;

					const producer = await createProducer({
						name: name,
						time: time,
						inventoryId: inventory.id,
					});

					const createdInputs = setProducerInputs({
						producerId: producer.id,
						inputs: inputs,
					});

					const createdOutputs = setProducerOutputs({
						producerId: producer.id,
						outputs: outputs,
					});

					const createdTags = setProducerTags({
						producerId: producer.id,
						tagIds: tagIds,
					});

					await Promise.all([createdInputs, createdOutputs, createdTags]);

					toast.success(`Producer '${name}' created`);

					form.reset({
						tagIds: tagIds,
					});
				}
				catch
				{
					toast.error('Failed to create producer');
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
					<CardTitle>Add Producer</CardTitle>
					<CardDescription>Add a new producer to this inventory.</CardDescription>
				</CardHeader>
				<CardContent className="flex min-h-0 flex-1 flex-col">
					<ProducerForm id="add-producer-form" form={form} onSubmit={onSubmit} />
				</CardContent>
				<CardFooter>
					<Field orientation="horizontal" className="flex w-full flex-row items-center justify-end gap-2">
						<Button type="button" variant="secondary" onClick={() => router.back()} className="flex-1">
							Cancel
						</Button>
						<Button
							type="submit"
							form="add-producer-form"
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
