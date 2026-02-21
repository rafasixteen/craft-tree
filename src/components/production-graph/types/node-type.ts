import type { Node as RFNode } from '@xyflow/react';
import { ItemNodeData, ProducerNodeData } from '@/components/production-graph/types';

export type NodeType = 'item' | 'producer';

export type ProducerGraphNode = RFNode<ProducerNodeData, 'producer'>;

export type ItemGraphNode = RFNode<ItemNodeData, 'item'>;

export type ProductionGraphNode = ProducerGraphNode | ItemGraphNode;
