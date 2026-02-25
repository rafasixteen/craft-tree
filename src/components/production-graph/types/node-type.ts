import type { Node as RFNode } from '@xyflow/react';
import { ItemNodeData, ProducerNodeData, SplitNodeData } from '@/components/production-graph/types';

export type NodeType = 'item' | 'producer' | 'split';

export type ProducerGraphNode = RFNode<ProducerNodeData, 'producer'>;

export type ItemGraphNode = RFNode<ItemNodeData, 'item'>;

export type SplitGraphNode = RFNode<SplitNodeData, 'split'>;

export type ProductionGraphNode = ProducerGraphNode | ItemGraphNode | SplitGraphNode;
