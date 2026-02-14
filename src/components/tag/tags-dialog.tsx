import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTags } from '@/domain/tag';
import { useActiveInventory } from '@/components/inventory';
import { ScrollArea } from '@/components/ui/scroll-area';
import React, { useCallback, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { XIcon } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { addTagFormSchema, AddTagFormValues } from '@/components/tag';
import { useForm, useWatch } from 'react-hook-form';

interface TagsDialogProps
{
	trigger: React.ReactNode;
}

export function TagsDialog({ trigger }: TagsDialogProps)
{
	const inventory = useActiveInventory()!;
	const { tags, createTag, deleteTag } = useTags(inventory.id);

	const [open, setOpen] = useState(false);
	const [isPending, startTransition] = useTransition();

	const { register, control, reset, handleSubmit, formState } = useForm({
		resolver: zodResolver(addTagFormSchema(tags)),
		defaultValues: { name: 'New Tag' },
		mode: 'onChange',
	});

	const watchedName = useWatch({
		control,
		name: 'name',
	});

	const onSubmit = useCallback(
		async function onSubmit(values: AddTagFormValues): Promise<void>
		{
			startTransition(async () =>
			{
				try
				{
					const { name } = values;

					await createTag(name);

					reset();

					toast.success(`Tag '${name}' added`);
				}
				catch
				{
					toast.error('Failed to create tag');
				}
			});
		},
		[createTag, reset],
	);

	function onDelete(tagId: string)
	{
		startTransition(async () =>
		{
			try
			{
				await deleteTag(tagId);

				const tag = tags.find((t) => t.id === tagId)!;
				toast.success(`Tag '${tag.name}' deleted`);
			}
			catch
			{
				toast.error('Failed to delete tag');
			}
		});
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>

			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Manage Tags</DialogTitle>
					<DialogDescription>Create and remove tags used to organize your inventory.</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)} className="mt-4">
					<div className="space-y-2">
						<div className="flex gap-2">
							{/* Tag Name Input */}
							<Input placeholder="New tag name…" {...register('name')} disabled={isPending} aria-invalid={!!formState.errors.name} />

							{/* Add Button */}
							<Button type="submit" disabled={isPending || !!formState.errors.name || !watchedName.trim()}>
								Add
							</Button>
						</div>

						<p className={cn('min-h-5 text-sm transition-opacity', formState.errors.name ? 'text-destructive opacity-100' : 'opacity-0')} aria-live="polite">
							{formState.errors.name?.message || ' '}
						</p>
					</div>
				</form>

				<ScrollArea className="h-72 rounded-md border">
					<div className="space-y-2 p-4">
						{tags.length > 0 ? (
							tags.map((tag, index) => (
								<React.Fragment key={tag.id}>
									<div className="flex items-center gap-2">
										<span className="text-sm">{tag.name}</span>

										<Button variant="destructive" size="icon-xs" className="ml-auto" onClick={() => onDelete(tag.id)} disabled={isPending}>
											<XIcon />
										</Button>
									</div>

									{index < tags.length - 1 && <Separator />}
								</React.Fragment>
							))
						) : (
							<p className="text-center text-sm text-muted-foreground">No tags yet.</p>
						)}
					</div>
				</ScrollArea>

				<DialogFooter>
					<Button variant="secondary" onClick={() => setOpen(false)}>
						Close
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
