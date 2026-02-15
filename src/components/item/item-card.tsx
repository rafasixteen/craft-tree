import { Card } from '@/components/ui/card';
import { Item } from '@/domain/item';
import { cva } from 'class-variance-authority';
import { ItemCellProps } from '@/components/item';

interface ItemCardProps extends ItemCellProps
{
	className?: string;
	item: Item;
}

const itemCardClass = cva('aspect-square rounded-xl', {
	variants: {
		selected: {
			true: 'ring-2 ring-primary',
		},
		hovered: {
			true: 'outline-1 outline-primary/50',
		},
		focused: {
			true: 'ring-2 ring-secondary',
		},
	},
	defaultVariants: {
		selected: false,
		hovered: false,
		focused: false,
	},
});

export function ItemCard({ item, ...props }: ItemCardProps)
{
	const { 'data-selected': selected, 'data-hovered': hovered, 'data-focused': focused, className } = props;

	return (
		<Card {...props} className={itemCardClass({ selected, hovered, focused, className })}>
			<div className="flex items-center gap-2">
				<p className="select-none">{item.name}</p>
				<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-primary-foreground">
					<p>{item.name.substring(0, 2).toUpperCase()}</p>
				</div>
			</div>
		</Card>
	);
}
