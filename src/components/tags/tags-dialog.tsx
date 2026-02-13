import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTags } from '@/domain/tag';
import { useActiveInventory } from '@/components/inventory';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMemo, useState, useTransition } from 'react';
import { nameSchema } from '@/domain/shared';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { XIcon } from 'lucide-react';
import React from 'react';

interface TagsDialogProps
{
	trigger: React.ReactNode;
}

export function TagsDialog({ trigger }: TagsDialogProps)
{
	const inventory = useActiveInventory()!;
	const { tags, createTag, deleteTag } = useTags(inventory.id);

	const [open, setOpen] = useState(false);
	const [newTag, setNewTag] = useState('');
	const [validationError, setValidationError] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();

	const tagExists = useMemo(() => tags.some((tag) => tag.name.toLowerCase() === newTag.trim().toLowerCase()), [tags, newTag]);

	function onCreate()
	{
		startTransition(async () =>
		{
			try
			{
				setValidationError(null);

				const parsed = nameSchema.safeParse(newTag);

				if (!parsed.success)
				{
					setValidationError(parsed.error.issues[0]?.message);
					return;
				}

				if (tagExists)
				{
					setValidationError('A tag with this name already exists.');
					return;
				}

				await createTag(parsed.data);
				setNewTag('');
				toast.success(`Tag '${parsed.data}' created`);
			}
			catch
			{
				toast.error('Failed to create tag');
			}
		});
	}

	function onDelete(tagId: string)
	{
		startTransition(async () =>
		{
			try
			{
				const tag = tags.find((t) => t.id === tagId)!;
				await deleteTag(tagId);
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

				<div className="space-y-2">
					<div className="flex gap-2">
						<Input placeholder="New tag name…" value={newTag} onChange={(e) => setNewTag(e.target.value)} disabled={isPending} aria-invalid={!!validationError} />
						<Button onClick={onCreate} disabled={isPending || !newTag.trim()}>
							Add
						</Button>
					</div>

					<p className={cn('min-h-5 text-sm transition-opacity', validationError ? 'text-destructive opacity-100' : 'opacity-0')} aria-live="polite">
						{validationError || 'placeholder'}
					</p>
				</div>

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
							<p className="text-sm text-muted-foreground">No tags yet.</p>
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
