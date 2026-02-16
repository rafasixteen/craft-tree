import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useActiveInventory } from '@/components/inventory';
import { useProducers } from '@/domain/producer';
import { useTags } from '@/domain/tag';
import { toast } from 'sonner';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateProducerFormValues, createProducerFormSchema } from '@/components/producer';
import { useTransition, useCallback } from 'react';
import { TagsCombobox } from '@/components/tag';
import { PlusIcon } from 'lucide-react';

export function CreateProducerSheet()
{
	const inventory = useActiveInventory();

	const { createProducer } = useProducers(inventory.id);
	const { tags } = useTags(inventory.id);

	const [isPending, startTransition] = useTransition();

	const { register, control, reset, handleSubmit, formState } = useForm({
		resolver: zodResolver(createProducerFormSchema),
		defaultValues: {
			name: '',
			tagNames: [],
		},
	});

	const onSubmit = useCallback(
		async function onSubmit(values: CreateProducerFormValues): Promise<void>
		{
			startTransition(async () =>
			{
				try
				{
					const { name, tagNames } = values;

					const selectedTags = tags.filter((tag) => tagNames.includes(tag.name));

					// TODO: Handle create properly.

					await createProducer({
						name: name,
						time: 1,
						inputs: [],
						outputs: [],
						tagIds: selectedTags.map((tag) => tag.id!),
					});

					reset({
						name: '',
						tagNames: values.tagNames,
					});

					toast.success(`Producer '${name}' created`);
				}
				catch
				{
					toast.error('Failed to create producer');
				}
			});
		},
		[createProducer, reset, tags],
	);

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="default" size="icon">
					<PlusIcon className="size-4" />
					<span className="sr-only">Add Producer</span>
				</Button>
			</SheetTrigger>
			<SheetContent>
				<form onSubmit={handleSubmit(onSubmit)} className="flex h-full flex-col">
					<SheetHeader>
						<SheetTitle>Create Producer</SheetTitle>
						<SheetDescription>Enter the details for your new producer.</SheetDescription>
					</SheetHeader>

					<div className="grid flex-1 auto-rows-min gap-6 px-4">
						<div className="grid gap-3">
							<Label htmlFor="producer-name">Name</Label>
							<Input id="producer-name" {...register('name')} placeholder="Producer name" />
						</div>
						<div className="grid gap-3">
							<Label htmlFor="producer-tag-names">Tags</Label>
							<Controller name="tagNames" control={control} render={({ field }) => <TagsCombobox value={field.value} onValueChange={field.onChange} />} />
						</div>
					</div>

					<SheetFooter>
						<Button type="submit" disabled={isPending || !formState.isValid}>
							Create
						</Button>
						<SheetClose asChild>
							<Button variant="outline">Cancel</Button>
						</SheetClose>
					</SheetFooter>
				</form>
			</SheetContent>
		</Sheet>
	);
}
