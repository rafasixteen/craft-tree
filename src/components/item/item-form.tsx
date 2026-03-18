'use client';

import { Controller, useForm } from 'react-hook-form';
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldDescription,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { TagsCombobox } from '@/components/tag/tags-combo-box';
import z from 'zod';

export const itemFormSchema = z.object({
	name: z
		.string()
		.trim()
		.min(1, 'Please enter a name.')
		.max(64, 'Name must be at most 64 characters.')
		.transform((val) => val.split(' ').filter(Boolean).join(' ')),
	tagIds: z.string().array(),
});

export type ItemFormValues = z.infer<typeof itemFormSchema>;

interface ItemFormProps
{
	id: string;
	form: ReturnType<typeof useForm<ItemFormValues>>;
	onSubmit: (data: ItemFormValues) => Promise<void>;
}

export function ItemForm({ id, form, onSubmit }: ItemFormProps)
{
	return (
		<form
			id={id}
			onSubmit={form.handleSubmit(onSubmit)}
			className="flex min-h-0 flex-1 flex-col"
		>
			<FieldGroup className="flex min-h-0 flex-1 flex-col">
				<Controller
					name="name"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="name">Name</FieldLabel>
							<FieldDescription>
								Name of the item for display purposes.
							</FieldDescription>
							<Input
								{...field}
								id="name"
								aria-invalid={fieldState.invalid}
								placeholder="Item name"
								autoComplete="off"
							/>
							{fieldState.invalid && (
								<FieldError errors={[fieldState.error]} />
							)}
						</Field>
					)}
				/>

				<Controller
					name="tagIds"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="tagIds">Tags</FieldLabel>
							<FieldDescription>
								Optional tags for categorizing items.
							</FieldDescription>
							<TagsCombobox
								{...field}
								onIdsChange={field.onChange}
								id="tagIds"
								aria-invalid={fieldState.invalid}
							/>
							{fieldState.invalid && (
								<FieldError errors={[fieldState.error]} />
							)}
						</Field>
					)}
				/>
			</FieldGroup>
		</form>
	);
}
