import { ExternalLinkIcon } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LinkableNameProps
{
	name: string;
	href: string;
	className?: string;
}

export function LinkableName({ name, href, className }: LinkableNameProps)
{
	return (
		<Link href={href} className={cn('group flex items-center gap-1', className)}>
			<span className="truncate hover:underline">{name}</span>
			<ExternalLinkIcon className="size-3 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
		</Link>
	);
}
