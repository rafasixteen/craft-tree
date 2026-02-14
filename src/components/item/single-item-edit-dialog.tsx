import { useState, useTransition } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useItems } from '@/domain/inventory';
import { useActiveInventory } from '@/components/inventory';
import { toast } from 'sonner';

interface SingleItemEditDialogProps
{
	trigger: React.ReactNode;
	item: { id: string; name: string };
}

export function SingleItemEditDialog({ trigger, item }: SingleItemEditDialogProps)
{
	const inventory = useActiveInventory()!;
	const { updateItem } = useItems(inventory.id);
	const [open, setOpen] = useState(false);
	const [name, setName] = useState(item.name);
	const [isPending, startTransition] = useTransition();

	function handleSave()
	{
		startTransition(async () =>
		{
			try
			{
				await updateItem(item.id, { name });
				toast.success('Item updated');
				setOpen(false);
			}
			catch
			{
				toast.error('Failed to update item');
			}
		});
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent className="p-6 rounded-lg bg-muted/70">
				<DialogHeader>
					<DialogTitle className="text-lg mb-2">Edit Item</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col gap-2 mt-1">
					<Input
						value={name}
						onChange={(e) => setName(e.target.value)}
						disabled={isPending}
						className="h-10 px-3 text-base rounded border border-border bg-background/90 focus:ring-2 focus:ring-primary/30"
					/>
					<Button disabled={isPending || !name.trim()} onClick={handleSave} className="h-10 text-base rounded">
						{isPending ? 'Saving...' : 'Save'}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
