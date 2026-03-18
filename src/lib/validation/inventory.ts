import { z } from 'zod';

const InventoryImportItemSchema = z.object({
	id: z.number(),
	name: z.string().min(1),
	tags: z.array(z.number()),
});

const InventoryImportProducerInputOutputSchema = z.object({
	itemId: z.number(),
	quantity: z.number().positive(),
});

const InventoryImportProducerSchema = z.object({
	id: z.number(),
	name: z.string().min(1),
	time: z.number().positive(),
	inputs: z.array(InventoryImportProducerInputOutputSchema),
	outputs: z.array(InventoryImportProducerInputOutputSchema).min(1),
	tags: z.array(z.number()),
});

const InventoryImportTagSchema = z.object({
	id: z.number(),
	name: z.string().min(1),
});

const InventoryImportProductionGraphSchema = z.object({
	name: z.string().min(1),
	data: z.any(),
});

export const InventoryImportSchema = z.object({
	inventory: z.string().min(1),
	tags: z.array(InventoryImportTagSchema),
	items: z.array(InventoryImportItemSchema),
	producers: z.array(InventoryImportProducerSchema),
	productionGraphs: z.array(InventoryImportProductionGraphSchema),
});

export type InventoryImport = z.infer<typeof InventoryImportSchema>;
