import { DefaultEdgeOptions, FitViewOptions, ReactFlowProps } from '@xyflow/react';
import { ItemNode, ProducerNode, SplitNode } from '@/components/production-graph/nodes';
import { ItemFlowEdge } from '@/components/production-graph/edges';
import { EdgeType, NodeType } from '@/components/production-graph/types';

const nodeTypes: Record<NodeType, React.ComponentType<any>> = {
	producer: ProducerNode,
	item: ItemNode,
	split: SplitNode,
};

const edgeTypes: Record<EdgeType, React.ComponentType<any>> = {
	'item-flow': ItemFlowEdge,
};

const fitViewOptions: FitViewOptions = {
	padding: 0.2,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
	animated: true,
	type: 'item-flow',
};

export const graphConfig = {
	nodeTypes,
	edgeTypes,
	fitView: true,
	fitViewOptions,
	snapToGrid: true,
	defaultEdgeOptions,
} satisfies Partial<ReactFlowProps>;
