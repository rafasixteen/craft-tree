'use client';

import { Header } from '@/components/sidebar';
import { ProducerForm, ProducerFormValues, producerFormSchema } from '@/components/producer';

import { Field } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import { setProducerInputs, setProducerOutputs, setProducerTags, updateProducer, useProducer } from '@/domain/producer';

import { toast } from 'sonner';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';

export default function ProducerEditPage()
{
	const router = useRouter();
	const params = useParams();

	const producerId = params['producer-id'] as string;
	const inventoryId = params['inventory-id'] as string;

	const { producer, inputs, outputs, tags } = useProducer({
		producerId,
		include: { inputs: true, outputs: true, tags: true },
	});

	if (!producer || !inputs || !outputs || !tags)
	{
		throw new Error('Producer, inputs, outputs, or tags is null.');
	}

	const form = useForm<ProducerFormValues>({
		resolver: zodResolver(producerFormSchema),
		mode: 'onChange',
		defaultValues: {
			name: producer.name,
			time: producer.time,
			inputs: inputs,
			outputs: outputs,
			tagIds: tags.map((tag) => tag.tagId),
		},
	});

	const onSubmit = useCallback(
		async function onSubmit(values: ProducerFormValues)
		{
			try
			{
				const { name, time, tagIds, inputs, outputs } = values;

				// TODO: Implement a single server action that updates this using a transaction.

				await Promise.all([
					updateProducer({ id: producerId, name: name, time: time }),
					setProducerInputs({ producerId: producerId, inputs: inputs }),
					setProducerOutputs({ producerId: producerId, outputs: outputs }),
					setProducerTags({ producerId: producerId, tagIds: tagIds }),
				]);

				toast.success(`Producer '${name}' updated`);
				router.push(`/inventories/${inventoryId}/producers`);
			}
			catch
			{
				toast.error('Failed to update producer');
			}
		},
		[producerId, inventoryId, router],
	);

	return (
		<div className="flex h-screen flex-col">
			<Header />
			<Card className="flex min-h-0 flex-1 flex-col bg-transparent ring-0">
				<CardHeader>
					<CardTitle>Edit Producer</CardTitle>
					<CardDescription>Edit an existing producer.</CardDescription>
				</CardHeader>
				<CardContent className="flex min-h-0 flex-1 flex-col">
					<ProducerForm id="edit-producer-form" form={form} onSubmit={onSubmit} />
				</CardContent>
				<CardFooter>
					<Field orientation="horizontal" className="flex w-full flex-row items-center justify-end gap-2">
						<Button type="button" variant="secondary" onClick={() => router.back()} className="flex-1">
							Cancel
						</Button>
						<Button
							type="submit"
							form="edit-producer-form"
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
