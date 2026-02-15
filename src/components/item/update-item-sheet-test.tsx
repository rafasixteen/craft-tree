import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Item } from '@/domain/item';

interface UpdateItemSheetProps extends React.ComponentProps<typeof Sheet>
{
	item: Item | null;
}

export function UpdateItemSheetTest({ item, ...props }: UpdateItemSheetProps)
{
	return (
		<Sheet {...props}>
			<SheetTrigger />
			<SheetContent>
				<form className="flex h-full flex-col">
					<SheetHeader>
						<SheetTitle>Update Item</SheetTitle>
						<SheetDescription>Update the details for your item.</SheetDescription>
					</SheetHeader>

					<div className="grid flex-1 auto-rows-min gap-6 px-4">
						<div className="grid gap-3">
							<Label htmlFor="item-name">Name</Label>
							<Input id="item-name" placeholder="Item name" />
						</div>
					</div>

					<SheetFooter>
						<Button type="submit">Save Changes</Button>
						<SheetClose asChild>
							<Button variant="outline">Cancel</Button>
						</SheetClose>
					</SheetFooter>
				</form>
			</SheetContent>
		</Sheet>
	);
}
