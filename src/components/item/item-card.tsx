import { Card } from '@/components/ui/card';
import { Item } from '@/domain/item';
import { cva } from 'class-variance-authority';
import { useItemSelection } from '@/components/item';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';
import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

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
	const { isSelected, toggleSelection, hasAnySelection } = useItemSelection();

	const [hovered, setHovered] = useState(false);
	const selected = isSelected(item.id);

	const itemCardClassName = itemCardClass({ selected, hovered });

	const pathname = usePathname();

	const href = `${pathname}/${item.id}`;
	const wrapperProps = !hasAnySelection ? { href: href } : {};

	const Wrapper: React.ElementType = hasAnySelection ? React.Fragment : Link;

	return (
		<Wrapper {...wrapperProps}>
			<Card {...props} className={itemCardClassName} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
				<div className="flex items-center gap-2">
					{hasAnySelection && <Checkbox checked={selected} onCheckedChange={() => toggleSelection(item.id)} tabIndex={-1} onClick={(e) => e.stopPropagation()} />}
					<p className="select-none">{item.name}</p>
				</div>
			</Card>
		</Wrapper>
	);
}
