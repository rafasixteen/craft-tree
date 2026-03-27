import { NodeType } from '@/domain/graph-v2';
import { DefaultEdgeOptions, FitViewOptions, ReactFlowProps, SelectionMode } from '@xyflow/react';
import { ItemNode, ProducerNode, SplitNode } from '@/components/graph-v2';

const nodeTypes: Record<NodeType, React.ComponentType<any>> = {
	item: ItemNode,
	producer: ProducerNode,
	split: SplitNode,
};

const fitViewOptions: FitViewOptions = {
	padding: 0.2,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
	animated: true,
	type: 'item-flow',
};

export const graphConfig = {
	nodeTypes: nodeTypes,
	fitView: true,
	fitViewOptions,
	snapToGrid: true,
	defaultEdgeOptions,
	deleteKeyCode: ['Delete', 'Backspace'],
	selectionKeyCode: ['Shift'],
	multiSelectionKeyCode: ['Control', 'Meta'],
	selectionMode: SelectionMode.Partial,
} satisfies Partial<ReactFlowProps>;
