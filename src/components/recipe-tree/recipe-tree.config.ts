import {
	DefaultEdgeOptions,
	FitViewOptions,
	ReactFlowProps,
} from '@xyflow/react';
import { RecipeTreeNodeType } from '@/components/recipe-tree/types';
import {
	ProcessedMaterialNode,
	RawMaterialNode,
} from '@/components/recipe-tree/nodes';

const nodeTypes: Record<RecipeTreeNodeType, React.ComponentType<any>> = {
	'processed-material': ProcessedMaterialNode,
	'raw-material': RawMaterialNode,
};

const fitViewOptions: FitViewOptions = {
	padding: 0.2,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
	animated: true,
	type: 'straight',
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
