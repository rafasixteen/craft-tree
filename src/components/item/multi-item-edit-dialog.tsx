import { useState, useTransition } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useItems } from '@/domain/item';
import { useActiveInventory } from '@/components/inventory';
import { toast } from 'sonner';

interface MultiItemEditDialogProps
{
	trigger: React.ReactNode;
	itemIds: string[];
	initialName?: string;
}

export function MultiItemEditDialog({ trigger, itemIds, initialName = '' }: MultiItemEditDialogProps)
{
	const inventory = useActiveInventory()!;
	const { updateItem } = useItems(inventory.id);
	const [open, setOpen] = useState(false);
	const [name, setName] = useState(initialName);
	const [isPending, startTransition] = useTransition();

	function handleSave()
	{
		startTransition(async () =>
		{
			try
			{
				await Promise.all(itemIds.map((id) => updateItem(id, { name })));
				toast.success('Items updated');
				setOpen(false);
			}
			catch
			{
				toast.error('Failed to update items');
			}
		});
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent className="p-6 rounded-lg bg-muted/70">
				<DialogHeader>
					<DialogTitle className="text-lg mb-2">Edit Multiple Items</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col gap-2 mt-1">
					<Input
						value={name}
						onChange={(e) => setName(e.target.value)}
						disabled={isPending}
						className="h-10 px-3 text-base rounded border border-border bg-background/90 focus:ring-2 focus:ring-primary/30"
						placeholder="New name for all selected items"
					/>
					<Button disabled={isPending || !name.trim()} onClick={handleSave} className="h-10 text-base rounded">
						{isPending ? 'Saving...' : 'Save All'}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
