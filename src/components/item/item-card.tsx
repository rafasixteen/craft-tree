import { Card } from '@/components/ui/card';
import { Item } from '@/domain/item';
import { cva } from 'class-variance-authority';
import { useItemSelection } from '@/components/item';
import { Checkbox } from '@/components/ui/checkbox';

interface ItemCardProps extends React.ComponentProps<typeof Card>
{
	item: Item;
}

const itemCardClass = cva('aspect-square rounded-xl', {
	variants: {
		selected: {
			true: 'ring-2 ring-primary',
		},
	},
	defaultVariants: {
		selected: false,
	},
});

export function ItemCard({ item, ...props }: ItemCardProps)
{
	const { isSelected, toggleSelection, hasAnySelection } = useItemSelection();

	const selected = isSelected(item.id);
	const itemCardClassName = itemCardClass({ selected });

	return (
		<Card {...props} className={itemCardClassName}>
			<div className="flex items-center gap-2">
				{hasAnySelection && <Checkbox checked={selected} onCheckedChange={() => toggleSelection(item.id)} tabIndex={-1} onClick={(e) => e.stopPropagation()} />}
				<p className="select-none">{item.name}</p>
			</div>
		</Card>
	);
}
