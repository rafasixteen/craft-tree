import { DefaultEdgeOptions, FitViewOptions, ReactFlowProps } from '@xyflow/react';
import { ItemNode, ProducerNode } from '@/components/production-graph/nodes';
import { ItemFlowEdge } from '@/components/production-graph/edges';
import { EdgeType, NodeType } from '@/components/production-graph/types';

const nodeTypes: Record<NodeType, React.ComponentType<any>> = {
	producer: ProducerNode,
	item: ItemNode,
};

const edgeTypes: Record<EdgeType, React.ComponentType<any>> = {
	'item-flow': ItemFlowEdge,
};

const fitViewOptions: FitViewOptions = {
	padding: 0.2,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
	animated: false,
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
