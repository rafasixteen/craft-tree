'use server';

import db from '@/db/client';
import {
	itemsTable,
	itemTagsTable,
	producerInputsTable,
	producerOutputsTable,
	producersTable,
	producerTagsTable,
	tagsTable,
	productionGraphsTable,
} from '@/db/schema';

import { Inventory, getInventoryById } from '@/domain/inventory';

import { InventoryImportSchema } from '@/lib/validation/inventory';

import { eq, inArray } from 'drizzle-orm';

export async function exportInventory(inventoryId: Inventory['id'])
{
	const inventory = await getInventoryById({ inventoryId });

	const [items, producers, tags, productionGraphs] = await Promise.all([
		db.select().from(itemsTable).where(eq(itemsTable.inventoryId, inventoryId)),
		db.select().from(producersTable).where(eq(producersTable.inventoryId, inventoryId)),
		db.select().from(tagsTable).where(eq(tagsTable.inventoryId, inventoryId)),
		db.select().from(productionGraphsTable).where(eq(productionGraphsTable.inventoryId, inventoryId)),
	]);

	const [producerInputs, producerOutputs, itemTags, producerTags] = await Promise.all([
		db
			.select()
			.from(producerInputsTable)
			.where(
				inArray(
					producerInputsTable.producerId,
					producers.map((p) => p.id),
				),
			),
		db
			.select()
			.from(producerOutputsTable)
			.where(
				inArray(
					producerOutputsTable.producerId,
					producers.map((p) => p.id),
				),
			),
		db
			.select()
			.from(itemTagsTable)
			.where(
				inArray(
					itemTagsTable.itemId,
					items.map((i) => i.id),
				),
			),
		db
			.select()
			.from(producerTagsTable)
			.where(
				inArray(
					producerTagsTable.producerId,
					producers.map((p) => p.id),
				),
			),
	]);

	const data = InventoryImportSchema.parse({
		inventory: inventory.name,
		tags: tags,
		items: items.map((item) => ({
			...item,
			tags: itemTags.filter((it) => it.itemId === item.id).map((it) => it.tagId),
		})),
		producers: producers.map((producer) => ({
			...producer,
			inputs: producerInputs
				.filter((input) => input.producerId === producer.id)
				.map((input) => ({
					itemId: input.itemId,
					quantity: input.quantity,
				})),
			outputs: producerOutputs
				.filter((output) => output.producerId === producer.id)
				.map((output) => ({
					itemId: output.itemId,
					quantity: output.quantity,
				})),
			tags: producerTags.filter((pt) => pt.producerId === producer.id).map((pt) => pt.tagId),
		})),
		productionGraphs: productionGraphs,
	});

	return JSON.stringify(data, null, 2);
}
