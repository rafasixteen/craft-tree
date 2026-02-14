import { useState, useTransition, useRef } from 'react';
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

	const inputRef = useRef<HTMLInputElement>(null);

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

				// Refocus input after state update and re-render.
				setTimeout(() =>
				{
					inputRef.current?.focus();
				}, 100);

				toast.success(`Item '${parsed.data}' added`);
			}
			catch
			{
				toast.error('Failed to add item');
			}
		});
	}

	function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>)
	{
		if (e.key === 'Enter' && !isPending)
		{
			e.preventDefault();
			handleCreate();
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent className="p-6 rounded-lg bg-muted/70">
				<DialogHeader>
					<DialogTitle className="text-lg mb-2">Add New Item</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col gap-2 mt-1">
					<Input
						ref={inputRef}
						placeholder="New item name..."
						value={name}
						onChange={(e) => setName(e.target.value)}
						onKeyDown={onInputKeyDown}
						disabled={isPending}
						autoFocus
						aria-invalid={!!validationError}
						className="h-10 px-3 text-base rounded border border-border bg-background/90 focus:ring-2 focus:ring-primary/30"
					/>

					<Button disabled={isPending || !name.trim()} onClick={handleCreate} className="h-10 text-base rounded">
						{isPending ? 'Adding...' : 'Add Item'}
					</Button>

					<p
						className={`min-h-5 text-sm px-1 py-0 rounded transition-all duration-200 ${validationError ? 'text-destructive bg-destructive/10 opacity-100' : 'opacity-0'}`}
						aria-live="polite"
					>
						{validationError || ' '}
					</p>
				</div>
			</DialogContent>
		</Dialog>
	);
}
