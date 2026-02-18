'use client';

import { useProducerInputs, useProducerOutputs, useProducerTags } from '@/domain/producer';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/craft-tree-sidebar';
import { useProducer } from '@/domain/producer';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet, FieldLegend, FieldContent, FieldDescription } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { TagsComboboxV2 } from '@/components/tag/tags-combo-box-v2';
import { useItems } from '@/domain/item';
import { XIcon } from 'lucide-react';
import { ItemCombobox } from '@/components/item';
import { useActiveInventory } from '@/components/inventory';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { useCallback } from 'react';
import z from 'zod';

const pairSchema = z.object({
	itemId: z.string('Item must be selected').min(1, 'Item must be selected.'),
	quantity: z.number('Please enter a number.').positive('Quantity must be a positive number.').max(2_147_483_647, 'Quantity must be at most 2,147,483,647.'),
});

const formSchema = z.object({
	name: z
		.string()
		.min(1, 'Please enter a name.')
		.max(64, 'Name must be at most 64 characters.')
		.transform((val) => val.trim())
		.refine((val) => !/\s{2,}/.test(val), 'Name cannot contain multiple consecutive spaces.'),
	time: z.number('Please enter a number.').positive('Time must be a positive number.').max(86400, 'Time must be at most 86400 seconds.'),
	tagIds: z.string().array(),
	inputs: pairSchema.array().min(1, 'At least one input is required.'),
	outputs: pairSchema.array().min(1, 'At least one output is required.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function ProducerEditPage()
{
	const router = useRouter();

	const params = useParams();
	const producerId = params['producer-id'] as string;

	const { producer, updateProducer } = useProducer(producerId);

	const { inputs, setInputs } = useProducerInputs(producerId);
	const { outputs, setOutputs } = useProducerOutputs(producerId);
	const { tags, setTags } = useProducerTags(producerId);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: producer.name,
			time: producer.time,
			inputs: inputs,
			outputs: outputs,
			tagIds: tags.map((tag) => tag.tagId),
		},
	});

	const onSubmit = useCallback(
		async function onSubmit(values: FormValues)
		{
			try
			{
				const { name, time, tagIds, inputs, outputs } = values;

				updateProducer({ name, time });
				setInputs({ inputs });
				setOutputs({ outputs });
				setTags({ tagIds });

				toast.success(`Producer '${name}' updated`);

				router.push(`/inventory/${producer.inventoryId}/producers`);
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
					<form id="edit-producer-form" onSubmit={form.handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col">
						<FieldGroup className="flex min-h-0 flex-1 flex-col">
							<div className="flex flex-row gap-4">
								<Controller
									name="name"
									control={form.control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor="name">Name</FieldLabel>
											<Input {...field} id="name" aria-invalid={fieldState.invalid} placeholder="Name of the producer" autoComplete="off" />
											{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
										</Field>
									)}
								/>
								<Controller
									name="time"
									control={form.control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor="time">Time (seconds)</FieldLabel>
											<Input
												{...field}
												type="number"
												min={1}
												max={86400}
												id="time"
												aria-invalid={fieldState.invalid}
												placeholder="Time in seconds"
												onChange={(e) => field.onChange(e.target.valueAsNumber)}
											/>
											{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
										</Field>
									)}
								/>
							</div>

							<Controller
								name="tagIds"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="tagIds">Tags</FieldLabel>
										<TagsComboboxV2 {...field} onIdsChange={field.onChange} id="tagIds" aria-invalid={fieldState.invalid} />
										{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
									</Field>
								)}
							/>

							<div className="flex min-h-0 flex-1 flex-row gap-4">
								<ItemPairsFieldArray
									name="inputs"
									form={form}
									legend="Inputs"
									description="Define the items and quantities required as inputs for this producer."
								/>
								<ItemPairsFieldArray name="outputs" form={form} legend="Outputs" description="Define the items and quantities produced by this producer." />
							</div>
						</FieldGroup>
					</form>
				</CardContent>
				<CardFooter>
					<Field orientation="horizontal" className="flex w-full flex-row items-center justify-end gap-2">
						<Button type="button" variant="secondary" onClick={() => router.back()} className="flex-1">
							Cancel
						</Button>
						<Button type="submit" form="edit-producer-form" disabled={!form.formState.isDirty} className="flex-1">
							Save Changes
						</Button>
					</Field>
				</CardFooter>
			</Card>
		</div>
	);
}

interface ItemPairsFieldArrayProps
{
	name: 'inputs' | 'outputs';
	form: ReturnType<typeof useForm<FormValues>>;
	legend: string;
	description: string;
}

function ItemPairsFieldArray({ name, form, legend, description }: ItemPairsFieldArrayProps)
{
	const fieldArray = useFieldArray({
		control: form.control,
		name,
	});

	const inventory = useActiveInventory();
	const { items } = useItems(inventory.id);

	// Watch the array so changes trigger a re-render
	const fieldValues = form.watch(name);

	// Get all item IDs that are currently selected in the field array
	const usedItemIds = fieldValues.map((item) => item.itemId);

	// Count how many rows are already in use, including empty ones
	const rowCount = fieldValues.length;

	const remainingItemsCount = items.length - rowCount;

	// Disable add button if no more items left
	const disableAdd = remainingItemsCount <= 0;

	return (
		<FieldSet className="min-h-0 flex-1 basis-0 flex-col">
			<FieldLegend variant="label">{legend}</FieldLegend>
			<FieldDescription>{description}</FieldDescription>

			{/* Scrollable container */}
			<ScrollArea className="min-h-0 flex-1 basis-0 rounded-md border p-3 pb-0">
				{fieldArray.fields.map((field, index) =>
				{
					// Filter out already selected items except current row
					const filteredItems = items.filter((item) => !usedItemIds.includes(item.id) || item.id === fieldValues[index].itemId);

					return (
						<div key={field.id} className="flex gap-2 space-y-2">
							{/* Item selector */}
							<Controller
								key={`${field.id}-itemId`}
								name={`${name}.${index}.itemId`}
								control={form.control}
								render={({ field: controllerField, fieldState }) => (
									<Field orientation="horizontal" data-invalid={fieldState.invalid}>
										<FieldContent>
											<ItemCombobox {...controllerField} availableItems={filteredItems} id={`${name}-item-${index}`} aria-invalid={fieldState.invalid} />
											{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
										</FieldContent>
									</Field>
								)}
							/>

							{/* Quantity */}
							<Controller
								key={`${field.id}-quantity`}
								name={`${name}.${index}.quantity`}
								control={form.control}
								render={({ field: controllerField, fieldState }) => (
									<Field orientation="horizontal" data-invalid={fieldState.invalid}>
										<FieldContent>
											<Input
												{...controllerField}
												type="number"
												min={1}
												id={`${name}-quantity-${index}`}
												aria-invalid={fieldState.invalid}
												placeholder="Qty"
												onChange={(e) => controllerField.onChange(e.target.valueAsNumber)}
											/>
											{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
										</FieldContent>
									</Field>
								)}
							/>

							{/* Remove button */}
							<Button type="button" variant="destructive" size="icon" onClick={() => fieldArray.remove(index)} disabled={fieldArray.fields.length <= 1}>
								<XIcon className="size-4" />
							</Button>
						</div>
					);
				})}
			</ScrollArea>

			{/* Add button outside scroll area */}
			<Button type="button" variant="outline" onClick={() => fieldArray.append({ itemId: '', quantity: 1 })} disabled={disableAdd} className="mt-2">
				Add {legend.slice(0, -1)}
			</Button>
		</FieldSet>
	);
}
