import { Node } from '@xyflow/react';
import { ProducerNodeData } from '@/components/production-graph';
import { ProductionRate } from '@/domain/production-graph';

interface HandleDataParams
{
	node: Node<ProducerNodeData>;
	handleId: string;
}

export function getHandleProductionRate({ node, handleId }: HandleDataParams)
{
	const { producer } = node.data;

	if (!producer)
	{
		throw new Error('Producer is missing');
	}

	const pair = findPair(node, handleId);

	if (!pair)
	{
		throw new Error('Handle not found');
	}

	const itemsPerSecond = pair.quantity / producer.time;

	const throughput: ProductionRate = {
		amount: itemsPerSecond,
		per: 'second',
	};

	return {
		itemId: pair.itemId,
		throughput,
	};
}

function findPair(node: Node<ProducerNodeData>, handleId: string)
{
	const input = node.data.inputs?.find((i) => i.id === handleId);

	if (input)
	{
		return input;
	}

	const output = node.data.outputs?.find((o) => o.id === handleId);

	if (output)
	{
		return output;
	}
}
