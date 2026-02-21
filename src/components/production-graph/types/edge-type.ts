import type { Edge as RFEdge } from '@xyflow/react';
import { ItemFlowEdgeData } from '@/components/production-graph/types';

export type EdgeType = 'item-flow';

export type ItemFlowGraphEdge = RFEdge<ItemFlowEdgeData, 'item-flow'>;

export type ProductionGraphEdge = ItemFlowGraphEdge;
