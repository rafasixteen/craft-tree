import { z } from 'zod';

export const graphNodeSchema = z.object({
	id: z.string(),
	type: z.string(),
	position: z.object({
		x: z.number(),
		y: z.number(),
	}),
	data: z.record(z.string(), z.unknown()),
});

export const graphEdgeSchema = z.object({
	id: z.string(),
	type: z.string(),
	source: z.string(),
	sourceHandle: z.string(),
	target: z.string(),
	targetHandle: z.string(),
	data: z.record(z.string(), z.unknown()).optional(),
});

export const graphDataSchema = z.object({
	nodes: z.array(graphNodeSchema).default([]),
	edges: z.array(graphEdgeSchema).default([]),
});

export type GraphNode = z.infer<typeof graphNodeSchema>;

export type GraphEdge = z.infer<typeof graphEdgeSchema>;

export type GraphData = z.infer<typeof graphDataSchema>;
