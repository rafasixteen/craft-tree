import { Card } from '@/components/ui/card';
import { cva } from 'class-variance-authority';
import { ItemCellProps, ItemContextMenu } from '@/components/item';

const itemCardClass = cva('aspect-square rounded-xl', {
	variants: {
		selected: {
			true: 'ring-2 ring-primary',
		},
		hovered: {
			true: 'outline-1 outline-primary/50',
		},
		focused: {
			true: 'ring-2 ring-primary/50',
		},
	},
	defaultVariants: {
		selected: false,
		hovered: false,
		focused: false,
	},
});

export function ItemCell({ item, ...props }: ItemCellProps)
{
	const { 'data-selected': selected, 'data-hovered': hovered, 'data-focused': focused } = props;

	return (
		<ItemContextMenu item={item}>
			<Card {...props} className={itemCardClass({ selected, hovered, focused })}>
				<div className="flex items-center gap-2">
					<p className="select-none">{item.name}</p>
					<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-primary-foreground">
						<p>{item.name.substring(0, 2).toUpperCase()}</p>
					</div>
				</div>
			</Card>
		</ItemContextMenu>
	);
}
