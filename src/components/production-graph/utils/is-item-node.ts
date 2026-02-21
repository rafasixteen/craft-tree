import { ProductionGraphNode, ItemGraphNode } from '@/components/production-graph/types';

export function isItemNode(node: ProductionGraphNode | undefined): node is ItemGraphNode
{
	return node?.type === 'item';
}
