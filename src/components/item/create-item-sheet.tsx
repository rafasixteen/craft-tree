import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useActiveInventory } from '@/components/inventory';
import { useItems } from '@/domain/item';
import { useTags } from '@/domain/tag';
import { toast } from 'sonner';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateItemFormValues, createItemFormSchema } from '@/components/item';
import { useTransition, useCallback } from 'react';
import { TagsCombobox } from '@/components/tag';
import { PlusIcon } from 'lucide-react';

export function CreateItemSheet()
{
	const inventory = useActiveInventory();

	const { createItem } = useItems(inventory.id);
	const { tags } = useTags(inventory.id);

	const [isPending, startTransition] = useTransition();

	const { register, control, reset, handleSubmit, formState } = useForm({
		resolver: zodResolver(createItemFormSchema),
		defaultValues: {
			name: '',
			tagNames: [],
		},
	});

	const onSubmit = useCallback(
		async function onSubmit(values: CreateItemFormValues): Promise<void>
		{
			startTransition(async () =>
			{
				try
				{
					const { name, tagNames } = values;

					const selectedTags = tags.filter((tag) => tagNames.includes(tag.name));

					await createItem({
						name: name,
						icon: null,
						tagIds: selectedTags.map((tag) => tag.id!),
					});

					reset({
						name: '',
						tagNames: values.tagNames,
					});

					toast.success(`Item '${name}' created`);
				}
				catch
				{
					toast.error('Failed to create item');
				}
			});
		},
		[createItem, reset, tags],
	);

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="default" size="icon">
					<PlusIcon className="size-4" />
					<span className="sr-only">Add Item</span>
				</Button>
			</SheetTrigger>
			<SheetContent>
				<form onSubmit={handleSubmit(onSubmit)} className="flex h-full flex-col">
					<SheetHeader>
						<SheetTitle>Create Item</SheetTitle>
						<SheetDescription>Enter the details for your new item.</SheetDescription>
					</SheetHeader>

					<div className="grid flex-1 auto-rows-min gap-6 px-4">
						<div className="grid gap-3">
							<Label htmlFor="item-name">Name</Label>
							<Input id="item-name" {...register('name')} placeholder="Item name" />
						</div>
						<div className="grid gap-3">
							<Label htmlFor="item-tag-names">Tags</Label>
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
