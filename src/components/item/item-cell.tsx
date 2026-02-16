import { Card } from '@/components/ui/card';
import { cva } from 'class-variance-authority';
import { ItemCellProps, ItemContextMenu } from '@/components/item';

const itemCardClass = cva('group relative aspect-square rounded-2xl border bg-card transition-all duration-200 ease-out cursor-pointer select-none overflow-hidden', {
	variants: {
		selected: {
			true: 'ring-2 ring-primary shadow-md',
		},
		hovered: {
			true: 'border-primary/40 shadow-sm scale-[1.02]',
		},
	},
	defaultVariants: {
		selected: false,
		hovered: false,
	},
});

export function ItemCell({ item, ...props }: ItemCellProps)
{
	const { 'data-selected': selected, 'data-hovered': hovered } = props;

	return (
		<ItemContextMenu item={item}>
			<Card {...props} className={itemCardClass({ selected, hovered })}>
				<div className="flex h-full flex-col justify-between p-4">
					{/* Top Section (Icon) */}
					<div className="flex justify-between items-start">
						<div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-semibold text-sm transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
							{item.name.substring(0, 2).toUpperCase()}
						</div>
					</div>

					{/* Bottom Section (Title) */}
					<div className="mt-4">
						<p className="truncate text-sm font-medium text-foreground">{item.name}</p>
					</div>
				</div>

				{/* Subtle hover overlay */}
				<div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 bg-primary/5 transition-opacity" />
			</Card>
		</ItemContextMenu>
	);
}
