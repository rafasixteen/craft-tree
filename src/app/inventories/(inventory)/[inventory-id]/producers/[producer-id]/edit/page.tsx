'use client';

import { useProducerInputs, useProducerOutputs, useProducerTags } from '@/domain/producer';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/craft-tree-sidebar';
import { useProducer } from '@/domain/producer';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { toast } from 'sonner';
import { useCallback } from 'react';
import { ProducerForm, ProducerFormValues, producerFormSchema } from '@/components/producer';

export default function ProducerEditPage()
{
	const router = useRouter();
	const params = useParams();

	const producerId = params['producer-id'] as string;

	const { producer, updateProducer } = useProducer(producerId);

	const { inputs, setInputs } = useProducerInputs(producerId);
	const { outputs, setOutputs } = useProducerOutputs(producerId);
	const { tags, setTags } = useProducerTags(producerId);

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

				updateProducer({ name, time });
				setInputs({ inputs });
				setOutputs({ outputs });
				setTags({ tagIds });

				toast.success(`Producer '${name}' updated`);
				router.push(`/inventories/${producer.inventoryId}/producers`);
			}
			catch
			{
				toast.error('Failed to update producer');
			}
		},
		[updateProducer, setInputs, setOutputs, setTags, producer.inventoryId, router],
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
						<Button type="submit" form="edit-producer-form" disabled={!form.formState.isDirty || !form.formState.isValid} className="flex-1">
							Save Changes
						</Button>
					</Field>
				</CardFooter>
			</Card>
		</div>
	);
}
