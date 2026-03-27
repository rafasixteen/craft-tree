import { NodeRegistry, producerNodeDefinition, splitNodeDefinition, itemNodeDefinition } from '@/domain/graph-v2';

export const nodeRegistry = {
	item: itemNodeDefinition,
	producer: producerNodeDefinition,
	split: splitNodeDefinition,
} satisfies NodeRegistry;

export type NodeType = keyof typeof nodeRegistry;
