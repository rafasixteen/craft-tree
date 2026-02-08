import { PackageIcon, ClockIcon } from 'lucide-react';

interface NodeStatsProps
{
	title: string;
	quantity: number;
	time: number;
}

export function NodeStats({ title, quantity, time }: NodeStatsProps)
{
	return (
		<div className="flex-1">
			<p>{title}</p>
			<div className="flex items-center gap-1">
				<PackageIcon className="size-3" />
				<span>{quantity}x</span>
			</div>
			<div className="flex items-center gap-1">
				<ClockIcon className="size-3" />
				<span>{time}s</span>
			</div>
		</div>
	);
}
