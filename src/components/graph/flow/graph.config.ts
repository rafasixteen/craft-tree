import { ItemFlowEdge } from '@/components/graph/flow/edges';
import { EdgeType, NodeType } from '@/components/graph/flow/types';
import { ItemNode, ProducerNode, SplitNode } from '@/components/graph/flow/nodes';

import { DefaultEdgeOptions, FitViewOptions, ReactFlowProps, SelectionMode } from '@xyflow/react';

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
	deleteKeyCode: ['Delete', 'Backspace'],
	selectionKeyCode: ['Shift'],
	multiSelectionKeyCode: ['Control', 'Meta'],
	selectionMode: SelectionMode.Partial,
} satisfies Partial<ReactFlowProps>;
