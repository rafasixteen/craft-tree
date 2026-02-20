import { Card } from '@/components/ui/card';
import { ProducerNodeData } from '@/components/production-graph';
import { Edge, useReactFlow, Node } from '@xyflow/react';
import { Producer } from '@/domain/producer';
import { Button } from '@/components/ui/button';

interface ProducerNodeProps
{
	id: string;
	data: ProducerNodeData;
}

export function ProducerNode({ id, data }: ProducerNodeProps)
{
	const { updateNodeData } = useReactFlow<Node<ProducerNodeData>, Edge>();

	const testProducer: Producer = {
		id: 'test-producer',
		name: 'Test Producer',
		time: 1,
		inventoryId: 'test-inventory',
	};

	return (
		<Card className="px-2">
			<Button
				onClick={() =>
				{
					updateNodeData(id, {
						producer: testProducer,
					});
				}}
			>
				Set Producer
			</Button>
			<p>Producer Node - {id}</p>
			<p>Producer: {data.producer?.name ?? 'Choose Producer'}</p>
		</Card>
	);
}
