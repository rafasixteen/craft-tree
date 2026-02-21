import { ProductionGraphNode, ProducerGraphNode } from '@/components/production-graph/types';

export function isProducerNode(node: ProductionGraphNode | undefined): node is ProducerGraphNode
{
	return node?.type === 'producer';
}
