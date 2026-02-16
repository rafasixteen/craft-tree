import { ProducerCell } from '@/components/producer';
import { useGrid } from '@/components/grid';
import { Producer } from '@/domain/producer';

export function ProducerGrid()
{
	const { cells: producers, getGridProps, getCellProps } = useGrid<Producer>();

	return (
		<div className="grid auto-rows-min grid-cols-2 gap-4 md:grid-cols-6" {...getGridProps()}>
			{producers.map((producer) => (
				<ProducerCell key={producer.id} {...getCellProps(producer.id, producers.indexOf(producer))} />
			))}
		</div>
	);
}
