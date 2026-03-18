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
import z from 'zod';

export const inventoryFormSchema = z.object({
	name: z
		.string()
		.trim()
		.min(1, 'Please enter a name.')
		.max(64, 'Name must be at most 64 characters.')
		.transform((val) => val.split(' ').filter(Boolean).join(' ')),
});

export type InventoryFormValues = z.infer<typeof inventoryFormSchema>;

interface InventoryFormProps
{
	id: string;
	form: ReturnType<typeof useForm<InventoryFormValues>>;
	onSubmit: (data: InventoryFormValues) => Promise<void>;
}

export function InventoryForm({ id, form, onSubmit }: InventoryFormProps)
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
								Name of the inventory for display purposes.
							</FieldDescription>
							<Input
								{...field}
								id="name"
								aria-invalid={fieldState.invalid}
								placeholder="Inventory name"
								autoComplete="off"
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
