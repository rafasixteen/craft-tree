import type { Node as RFNode } from '@xyflow/react';
import { ProcessedMaterialNodeData, RawMaterialNodeData } from '@/components/recipe-tree-v2/types';

export type RecipeTreeNodeType = 'processed-material' | 'raw-material';

export type RecipeTreeNodeTypeDataMap = {
	'processed-material': ProcessedMaterialNodeData;
	'raw-material': RawMaterialNodeData;
};

export type ProcessedMaterialNode = RFNode<ProcessedMaterialNodeData, 'processed-material'>;

export type RawMaterialNode = RFNode<RawMaterialNodeData, 'raw-material'>;

export type RecipeTreeNode = ProcessedMaterialNode | RawMaterialNode;
