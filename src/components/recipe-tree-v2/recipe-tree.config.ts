import { DefaultEdgeOptions, FitViewOptions, ReactFlowProps } from '@xyflow/react';
import { RecipeTreeNodeType } from '@/components/recipe-tree-v2/types';
import { ProcessedMaterialNodeComponent, RawMaterialNodeComponent } from '@/components/recipe-tree-v2/nodes';

const nodeTypes: Record<RecipeTreeNodeType, React.ComponentType<any>> = {
	'processed-material': ProcessedMaterialNodeComponent,
	'raw-material': RawMaterialNodeComponent,
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
