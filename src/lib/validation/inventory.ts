import { z } from 'zod';

const InventoryImportItemSchema = z.object({
	id: z.number(),
	name: z.string().min(1),
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
});

export const InventoryImportSchema = z.object({
	inventory: z.string().min(1),
	items: z.array(InventoryImportItemSchema),
	producers: z.array(InventoryImportProducerSchema),
});

export type InventoryImport = z.infer<typeof InventoryImportSchema>;
