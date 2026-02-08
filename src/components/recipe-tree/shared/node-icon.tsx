import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

interface NodeIconProps extends VariantProps<typeof iconVariants>
{
	itemName: string;
}

const iconVariants = cva('flex items-center justify-center rounded-sm border font-mono font-semibold', {
	variants: {
		size: {
			sm: 'size-6 text-xs',
			md: 'size-8 text-xs',
			lg: 'size-10 text-sm',
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

export function NodeIcon({ itemName, ...iconProps }: NodeIconProps)
{
	const initials = itemName.substring(0, 2).toUpperCase();
	return <p className={cn(iconVariants(iconProps))}>{initials}</p>;
}
