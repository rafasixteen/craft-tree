import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useActiveInventory } from '@/components/inventory';
import { Item, useItems, useItemTags } from '@/domain/item';
import { useTags } from '@/domain/tag';
import { toast } from 'sonner';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateItemFormValues, updateItemFormSchema } from '@/components/item';
import { useTransition, useCallback } from 'react';
import { TagsCombobox } from '@/components/tag';

interface UpdateItemSheetProps extends React.ComponentProps<typeof Sheet>
{
	item: Item;
}

export function UpdateItemSheet({ item, ...props }: UpdateItemSheetProps)
{
	const inventory = useActiveInventory();

	const { updateItem } = useItems(inventory.id);

	const { tags: itemTags } = useItemTags(item.id);
	const { tags: inventoryTags } = useTags(inventory.id);

	const [isPending, startTransition] = useTransition();

	const { register, control, reset, handleSubmit, formState } = useForm({
		resolver: zodResolver(updateItemFormSchema),
		defaultValues: {
			name: item.name,
			tagNames: inventoryTags.filter((tag) => itemTags.some((itemTag) => itemTag.tagId === tag.id)).map((tag) => tag.name),
		},
	});

	const onSubmit = useCallback(
		async function onSubmit(values: UpdateItemFormValues): Promise<void>
		{
			startTransition(async () =>
			{
				try
				{
					const { name, tagNames } = values;

					const selectedTags = inventoryTags.filter((tag) => tagNames.includes(tag.name));

					await updateItem({
						itemId: item.id,
						name: name,
						tagIds: selectedTags.map((tag) => tag.id!),
					});

					reset({
						name: name,
						tagNames: values.tagNames,
					});

					toast.success(`Item '${name}' updated`);
				}
				catch
				{
					toast.error('Failed to update item');
				}
			});
		},
		[updateItem, reset, inventoryTags, item.id],
	);

	return (
		<Sheet {...props}>
			<SheetTrigger />
			<SheetContent>
				<form onSubmit={handleSubmit(onSubmit)} className="flex h-full flex-col">
					<SheetHeader>
						<SheetTitle>Update Item</SheetTitle>
						<SheetDescription>Update the details for your item.</SheetDescription>
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
							Save Changes
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
