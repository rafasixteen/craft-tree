import { useNodeConnections, useNodes } from '@xyflow/react';
import { ProductionGraphNode } from '@/components/production-graph/types';
import { getSourceItemRate } from '@/components/production-graph/utils';

export function useIncomingItemRate(nodeId?: string, handleId?: string | null)
{
	const connections = useNodeConnections({
		id: nodeId,
		handleType: 'target',
		handleId: handleId ?? undefined,
	});

	const sourceId = connections?.[0]?.source;
	const sourceHandle = connections?.[0]?.sourceHandle;

	const node = useNodes<ProductionGraphNode>().find((n) => n.id === sourceId);
	return getSourceItemRate(node, sourceHandle);
}
