import { useNodeConnections, useNodes } from '@xyflow/react';
import { ProductionGraphNode } from '@/components/production-graph/types';
import { getSourceItemRate } from '@/components/production-graph/utils';

export function useIncomingItemRate(handleId?: string)
{
	const connections = useNodeConnections({
		handleType: 'target',
		handleId,
	});

	const sourceId = connections?.[0]?.source;
	const sourceHandle = connections?.[0]?.sourceHandle;

	const node = useNodes<ProductionGraphNode>().find((n) => n.id === sourceId);
	return getSourceItemRate(node, sourceHandle);
}
