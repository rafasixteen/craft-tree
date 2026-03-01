import { useNodesData } from '@xyflow/react';
import { ProductionGraphNode } from '@/components/production-graph/flow/types';

export function useNodeType(nodeId?: string | null): ProductionGraphNode['type'] | undefined
{
	const node = useNodesData<ProductionGraphNode>(nodeId ?? '');
	return node?.type;
}
