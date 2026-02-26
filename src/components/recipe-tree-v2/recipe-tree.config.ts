import { DefaultEdgeOptions, FitViewOptions, ReactFlowProps } from '@xyflow/react';
import { RecipeTreeNodeType } from '@/components/recipe-tree-v2/types';
import { ProcessedMaterialNode, RateControlNode, RawMaterialNode } from '@/components/recipe-tree-v2/nodes';

const nodeTypes: Record<RecipeTreeNodeType, React.ComponentType<any>> = {
	'processed-material': ProcessedMaterialNode,
	'raw-material': RawMaterialNode,
	'rate-control': RateControlNode,
};

const fitViewOptions: FitViewOptions = {
	padding: 0.2,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
	animated: true,
	type: 'smoothstep',
};

export const config = {
	nodeTypes,
	fitView: true,
	fitViewOptions,
	snapToGrid: true,
	defaultEdgeOptions,
	nodesDraggable: false,
	deleteKeyCode: null,
} satisfies Partial<ReactFlowProps>;
