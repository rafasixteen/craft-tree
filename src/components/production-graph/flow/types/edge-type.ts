import { ItemFlowEdgeData } from '@/components/production-graph/flow/types';

import type { Edge as RFEdge } from '@xyflow/react';

export type EdgeType = 'item-flow';

export type ItemFlowGraphEdge = RFEdge<ItemFlowEdgeData, 'item-flow'>;

export type ProductionGraphEdge = ItemFlowGraphEdge;
