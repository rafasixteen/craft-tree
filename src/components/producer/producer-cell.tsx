import { Card } from '@/components/ui/card';
import { cva } from 'class-variance-authority';
import { ProducerContextMenu } from '@/components/producer';
import { CellProps } from '@/components/grid';
import { Producer } from '@/domain/producer';

const producerCardClass = cva('group relative aspect-square cursor-pointer overflow-hidden rounded-2xl border bg-card transition-all duration-200 ease-out select-none', {
	variants: {
		selected: {
			true: 'shadow-md ring-2 ring-primary',
		},
		hovered: {
			true: 'scale-[1.02] border-primary/40 shadow-sm',
		},
	},
	defaultVariants: {
		selected: false,
		hovered: false,
	},
});

export function ProducerCell({ item: producer, ...props }: CellProps<Producer>)
{
	const { 'data-selected': selected, 'data-hovered': hovered } = props;

	return (
		<ProducerContextMenu producer={producer}>
			<Card {...props} className={producerCardClass({ selected, hovered })}>
				<div className="flex h-full flex-col justify-between p-4">
					{/* Top Section (Icon) */}
					<div className="flex items-start justify-between">
						<div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-sm font-semibold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
							{producer.name.substring(0, 2).toUpperCase()}
						</div>
					</div>

					{/* Bottom Section (Title) */}
					<div className="mt-4">
						<p className="truncate text-sm font-medium text-foreground">{producer.name}</p>
					</div>
				</div>

				{/* Subtle hover overlay */}
				<div className="pointer-events-none absolute inset-0 bg-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />
			</Card>
		</ProducerContextMenu>
	);
}
