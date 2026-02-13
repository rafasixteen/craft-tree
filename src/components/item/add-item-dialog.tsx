import { useState, useTransition } from 'react';
import { useItems } from '@/domain/inventory';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useActiveInventory } from '@/components/inventory';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { nameSchema } from '@/domain/shared';
import { toast } from 'sonner';

interface AddItemDialogProps
{
	trigger: React.ReactNode;
}

export function AddItemDialog({ trigger }: AddItemDialogProps)
{
	const inventory = useActiveInventory()!;
	const { createItem } = useItems(inventory.id);

	const [open, setOpen] = useState(false);
	const [name, setName] = useState('');
	const [validationError, setValidationError] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();

	function handleCreate()
	{
		startTransition(async () =>
		{
			setValidationError(null);

			const parsed = nameSchema.safeParse(name);

			if (!parsed.success)
			{
				setValidationError(parsed.error.issues[0]?.message);
				return;
			}

			try
			{
				await createItem(parsed.data, null);
				setName('');
				setOpen(false);

				toast.success(`Item '${parsed.data}' added`);
			}
			catch
			{
				toast.error('Failed to add item');
			}
		});
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add New Item</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col gap-2">
					<Input placeholder="New item name..." value={name} onChange={(e) => setName(e.target.value)} disabled={isPending} autoFocus aria-invalid={!!validationError} />
					<Button disabled={isPending || !name.trim()} onClick={handleCreate}>
						{isPending ? 'Adding...' : 'Add Item'}
					</Button>
					<p className={`min-h-5 text-sm transition-opacity ${validationError ? 'text-destructive opacity-100' : 'opacity-0'}`} aria-live="polite">
						{validationError || 'placeholder'}
					</p>
				</div>
			</DialogContent>
		</Dialog>
	);
}
