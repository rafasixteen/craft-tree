import { producerNodeDefinition, splitNodeDefinition, itemNodeDefinition } from '@/domain/graph-v2';
import { z } from 'zod';

export const nodeRegistry = {
	item: itemNodeDefinition,
	split: splitNodeDefinition,
	producer: producerNodeDefinition,
};

export interface NodeOutputRegistry
{}

export type AnyNodeOutput = {
	[K in keyof NodeOutputRegistry]: { type: K } & NodeOutputRegistry[K];
}[keyof NodeOutputRegistry];

export type NodeType = keyof typeof nodeRegistry;
