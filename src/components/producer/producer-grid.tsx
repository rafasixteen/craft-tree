import { ProducerCell } from '@/components/producer';
import { useItemGridGeneric } from '@/components/grid';
import { Producer } from '@/domain/producer';

export function ProducerGrid()
{
	const { items: producers, getItemGridProps, getItemCellProps } = useItemGridGeneric<Producer>();

	return (
		<div className="grid auto-rows-min grid-cols-2 gap-4 md:grid-cols-6" {...getItemGridProps()}>
			{producers.map((producer) => (
				<ProducerCell key={producer.id} {...getItemCellProps(producer.id, producers.indexOf(producer))} />
			))}
		</div>
	);
}
