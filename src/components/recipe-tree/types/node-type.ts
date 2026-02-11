import { BaseNodeData, ProcessedMaterialNodeData, RawMaterialNodeData } from '@/components/recipe-tree';

export type NodeType = 'rate-control' | 'processed-material' | 'raw-material';

export type NodeTypeDataMap = {
	'rate-control': BaseNodeData;
	'processed-material': ProcessedMaterialNodeData;
	'raw-material': RawMaterialNodeData;
};
