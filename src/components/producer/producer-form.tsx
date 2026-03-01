'use client';

import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel, FieldContent, FieldDescription } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { TagsCombobox } from '@/components/tag/tags-combo-box';
import { useItems } from '@/domain/item';
import { XIcon } from 'lucide-react';
import { ItemCombobox } from '@/components/item';
import { useCurrentInventory } from '@/components/inventory';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import z from 'zod';

const pairSchema = z.object({
	itemId: z.string('Item must be selected').min(1, 'Item must be selected.'),
	quantity: z.number('Please enter a number.').positive('Quantity must be a positive number.').max(2_147_483_647, 'Quantity must be at most 2,147,483,647.'),
});

export const producerFormSchema = z.object({
	name: z
		.string()
		.trim()
		.min(1, 'Please enter a name.')
		.max(64, 'Name must be at most 64 characters.')
		.transform((val) => val.split(' ').filter(Boolean).join(' ')),
	time: z.number('Please enter a number.').positive('Time must be a positive number.').max(86400, 'Time must be at most 86400 seconds.'),
	tagIds: z.string().array(),
	inputs: pairSchema.array().min(1, 'At least one input is required.'),
	outputs: pairSchema.array().min(1, 'At least one output is required.'),
});

export type ProducerFormValues = z.infer<typeof producerFormSchema>;

interface ProducerFormProps
{
	id: string;
	form: ReturnType<typeof useForm<ProducerFormValues>>;
	onSubmit: (data: ProducerFormValues) => Promise<void>;
}

export function ProducerForm({ id, form, onSubmit }: ProducerFormProps)
{
	return (
		<form id={id} onSubmit={form.handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col">
			<FieldGroup className="flex min-h-0 flex-1 flex-col">
				<div className="flex flex-row gap-4">
					<Controller
						name="name"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="name">Name</FieldLabel>
								<FieldDescription>Name of the producer for display purposes.</FieldDescription>
								<Input {...field} id="name" aria-invalid={fieldState.invalid} placeholder="Producer name" autoComplete="off" />
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
								<FieldDescription>Time required to produce the outputs.</FieldDescription>
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
							<FieldDescription>Optional tags for categorizing producers.</FieldDescription>
							<TagsCombobox {...field} onIdsChange={field.onChange} id="tagIds" aria-invalid={fieldState.invalid} />
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>

				<div className="flex min-h-0 flex-1 flex-row gap-4">
					<Controller
						name="inputs"
						control={form.control}
						render={({ fieldState }) => (
							<ItemPairsFieldArray name="inputs" form={form} description="Items required to produce outputs." data-invalid={fieldState.invalid} />
						)}
					/>
					<Controller
						name="outputs"
						control={form.control}
						render={({ fieldState }) => (
							<ItemPairsFieldArray name="outputs" form={form} description="Items produced by this producer." data-invalid={fieldState.invalid} />
						)}
					/>
				</div>
			</FieldGroup>
		</form>
	);
}

interface ItemPairsFieldArrayProps
{
	name: 'inputs' | 'outputs';
	form: ReturnType<typeof useForm<ProducerFormValues>>;
	description?: string;
}

function ItemPairsFieldArray({ name, form, description }: ItemPairsFieldArrayProps)
{
	const fieldArray = useFieldArray({
		control: form.control,
		name,
	});

	const inventory = useCurrentInventory();
	const { items } = useItems({ inventoryId: inventory.id });

	const legend = name === 'inputs' ? 'Inputs' : 'Outputs';

	// Watch the array so changes trigger a re-render
	const fieldValues = form.watch(name);

	// Get all item IDs that are currently selected in the field array
	const usedItemIds = fieldValues.map((item) => item.itemId);

	// Count how many rows are already in use, including empty ones
	const rowCount = fieldValues.length;

	const remainingItemsCount = items.length - rowCount;

	// Disable add button if no more items left
	const disableAdd = remainingItemsCount <= 0;

	const classNameFromInput =
		'bg-input/20 dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/30 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 h-7 rounded-md border px-2 py-0.5 text-sm transition-colors file:h-6 file:text-xs/relaxed file:font-medium focus-visible:ring-2 aria-invalid:ring-2 md:text-xs/relaxed file:text-foreground placeholder:text-muted-foreground w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50';

	const dataInvalid = form.formState.errors[name]?.message !== undefined;

	return (
		<Field className="min-h-0 flex-1 basis-0 flex-col">
			<FieldLabel className={cn(dataInvalid && 'text-destructive')}>{legend}</FieldLabel>
			{description && <FieldDescription>{description}</FieldDescription>}

			{/* Scrollable container */}
			<ScrollArea className={cn(classNameFromInput, 'min-h-0 flex-1 basis-0 rounded-md border p-3 pb-0')} aria-invalid={dataInvalid}>
				{/* Sticky top button */}
				<div className="sticky top-0 z-10 pb-3">
					<div className="rounded-md backdrop-blur-md">
						<Button type="button" variant="secondary" onClick={() => fieldArray.append({ itemId: '', quantity: 1 })} disabled={disableAdd} className="w-full">
							Add {legend.slice(0, -1)}
						</Button>
					</div>
				</div>

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
											<ItemCombobox {...controllerField} items={filteredItems} id={`${name}-item-${index}`} aria-invalid={fieldState.invalid} />
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

			{form.formState.errors[name]?.message && <FieldError errors={[form.formState.errors[name]]} />}
		</Field>
	);
}
