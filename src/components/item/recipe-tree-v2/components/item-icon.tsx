import { Item } from '@/domain/item';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const iconVariants = cva('flex items-center justify-center rounded border font-mono font-semibold', {
	variants: {
		size: {
			sm: 'w-6 h-6 text-xs',
			md: 'w-8 h-8 text-xs',
			lg: 'w-10 h-10 text-sm',
		},
		variant: {
			default: 'bg-muted',
			primary: 'bg-primary text-primary-foreground',
			secondary: 'bg-secondary text-secondary-foreground',
			destructive: 'bg-destructive',
		},
	},
	defaultVariants: {
		size: 'md',
		variant: 'default',
	},
});

const badgeVariants = cva('absolute flex items-center justify-center rounded-full font-bold', {
	variants: {
		size: {
			xs: 'w-3 h-3 text-[8px]',
			sm: 'w-4 h-4 text-xs',
			md: 'w-5 h-5 text-xs',
			lg: 'w-6 h-6 text-sm',
		},
		variant: {
			default: 'bg-primary text-primary-foreground',
			secondary: 'bg-secondary text-secondary-foreground',
			destructive: 'bg-destructive text-destructive-foreground',
			'no-bg': 'bg-transparent text-foreground',
		},
		position: {
			'top-right': 'top-[var(--y)] right-[var(--x)] translate-x-1/2 -translate-y-1/2',
			'top-left': 'top-[var(--y)] left-[var(--x)] -translate-x-1/2 -translate-y-1/2',
			'bottom-right': 'bottom-[var(--y)] right-[var(--x)] translate-x-1/2 translate-y-1/2',
			'bottom-left': 'bottom-[var(--y)] left-[var(--x)] -translate-x-1/2 translate-y-1/2',
		},
		offset: {
			center: '[--x:50%] [--y:50%]',
			mid: '[--x:20%] [--y:20%]',
			corner: '[--x:0%] [--y:0%]',
			out: '[--x:100%] [--y:100%]',
			far: '[--x:120%] [--y:120%]',
		},
	},
	defaultVariants: {
		size: 'sm',
		variant: 'default',
		position: 'bottom-right',
		offset: 'corner',
	},
});

interface ItemIconProps extends React.HTMLAttributes<HTMLDivElement>
{
	item: Item;
	quantity?: number;
	icon?: VariantProps<typeof iconVariants>;
	badge?: VariantProps<typeof badgeVariants>;
}

export function ItemIcon({ item, quantity, icon, badge, ...props }: ItemIconProps)
{
	const initials = item.name.substring(0, 2).toUpperCase();

	const iconClassName = cn(iconVariants(icon));
	const badgeClassName = cn(badgeVariants(badge));

	const shouldDisplayBadge = quantity !== undefined && quantity > 0;

	return (
		<div className="relative" {...props}>
			<div className={iconClassName}>{initials}</div>
			{shouldDisplayBadge && <div className={badgeClassName}>{quantity}</div>}
		</div>
	);
}
