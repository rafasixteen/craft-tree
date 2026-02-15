import { useState, useTransition, useEffect, useCallback } from 'react';
import { useItems } from '@/domain/item';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useActiveInventory } from '@/components/inventory';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { TagsCombobox } from '@/components/tag/tags-combo-box';
import { useTags } from '@/domain/tag';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AddItemFormValues, addItemFormSchema } from '@/components/item';

interface AddItemDialogProps
{
	trigger: React.ReactNode;
}

export function AddItemDialog({ trigger }: AddItemDialogProps)
{
	const inventory = useActiveInventory()!;
	const { createItem } = useItems(inventory.id);
	const { tags } = useTags(inventory.id);

	const [open, setOpen] = useState(false);
	const [isPending, startTransition] = useTransition();

	const { register, control, reset, handleSubmit, formState } = useForm({
		resolver: zodResolver(addItemFormSchema),
		defaultValues: {
			name: '',
			tagNames: [],
		},
	});

	const watchedName = useWatch({
		control,
		name: 'name',
	});

	const onSubmit = useCallback(
		async function onSubmit(values: AddItemFormValues): Promise<void>
		{
			startTransition(async () =>
			{
				try
				{
					const { name, tagNames } = values;

					const selectedTags = tags.filter((t) => tagNames.includes(t.name));

					await createItem({
						name,
						icon: null,
						tagIds: selectedTags.map((t) => t.id!),
					});

					reset({
						name: '',
						tagNames: values.tagNames,
					});

					toast.success(`Item '${name}' added`);
				}
				catch
				{
					toast.error('Failed to add item');
				}
			});
		},
		[createItem, tags, reset],
	);

	useEffect(() =>
	{
		if (!open)
		{
			reset();
		}
	}, [open]);

	return (
		<Dialog open={open} onOpenChange={setOpen} modal={false}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent className="p-6 rounded-lg">
				<DialogHeader>
					<DialogTitle>Add New Item</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 mt-2">
					{/* Name input */}
					<Input {...register('name')} placeholder="New item name..." disabled={isPending} aria-invalid={!!formState.errors.name} />
					{formState.errors.name && <p className="text-sm text-destructive">{formState.errors.name.message}</p>}

					{/* TagsCombobox */}
					<Controller name="tagNames" control={control} render={({ field }) => <TagsCombobox value={field.value} onValueChange={field.onChange} />} />

					{/* Submit button */}
					<Button type="submit" disabled={isPending || !watchedName?.trim()}>
						{isPending ? 'Adding...' : 'Add Item'}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
