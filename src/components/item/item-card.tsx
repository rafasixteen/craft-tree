import { Card } from '@/components/ui/card';
import { Item } from '@/domain/item';
import { cva } from 'class-variance-authority';
import React from 'react';

interface ItemCardProps extends React.ComponentProps<typeof Card>
{
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
	},
	defaultVariants: {
		selected: false,
		hovered: false,
	},
});

export function ItemCard({ item, ...props }: ItemCardProps)
{
	// TODO: Find a way to get item state from the UI context.

	// const itemCardClassName = itemCardClass({ selected, hovered });
	const itemCardClassName = itemCardClass();

	return (
		<Card {...props} className={itemCardClassName}>
			<div className="flex items-center gap-2">
				<p className="select-none">{item.name}</p>
				<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-primary-foreground">
					<p>{item.name.substring(0, 2).toUpperCase()}</p>
				</div>
			</div>
		</Card>
	);
}
