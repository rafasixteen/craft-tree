'use client';

import { Input } from '@/components/ui/input';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';

import z from 'zod';
import { Controller, useForm } from 'react-hook-form';

export const productionGraphFormSchema = z.object({
	name: z
		.string()
		.trim()
		.min(1, 'Please enter a name.')
		.max(64, 'Name must be at most 64 characters.')
		.transform((val) => val.split(' ').filter(Boolean).join(' ')),
});

export type ProductionGraphFormValues = z.infer<typeof productionGraphFormSchema>;

interface ProductionGraphFormProps
{
	id: string;
	form: ReturnType<typeof useForm<ProductionGraphFormValues>>;
	onSubmit: (data: ProductionGraphFormValues) => Promise<void>;
}

export function ProductionGraphForm({ id, form, onSubmit }: ProductionGraphFormProps)
{
	return (
		<form id={id} onSubmit={form.handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col">
			<FieldGroup className="flex min-h-0 flex-1 flex-col">
				<Controller
					name="name"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="name">Name</FieldLabel>
							<FieldDescription>Name of the production graph for display purposes.</FieldDescription>
							<Input
								{...field}
								id="name"
								aria-invalid={fieldState.invalid}
								placeholder="Production graph name"
								autoComplete="off"
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>
			</FieldGroup>
		</form>
	);
}
