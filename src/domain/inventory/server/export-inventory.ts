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
	const inventory = await getInventoryById(inventoryId);

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

	const tagExportId = (dbId: string) => tags.findIndex((t) => t.id === dbId) + 1;

	const data = InventoryImportSchema.parse({
		inventory: inventory.name,
		tags: tags.map((tag, index) => ({
			id: index + 1,
			name: tag.name,
		})),
		items: items.map((item, index) => ({
			id: index + 1,
			name: item.name,
			tags: itemTags.filter((it) => it.itemId === item.id).map((it) => tagExportId(it.tagId)),
		})),
		producers: producers.map((producer, index) => ({
			id: index + 1,
			name: producer.name,
			time: producer.time,
			inputs: producerInputs
				.filter((input) => input.producerId === producer.id)
				.map((input) => ({
					itemId: items.findIndex((item) => item.id === input.itemId) + 1,
					quantity: input.quantity,
				})),
			outputs: producerOutputs
				.filter((output) => output.producerId === producer.id)
				.map((output) => ({
					itemId: items.findIndex((item) => item.id === output.itemId) + 1,
					quantity: output.quantity,
				})),
			tags: producerTags.filter((pt) => pt.producerId === producer.id).map((pt) => tagExportId(pt.tagId)),
		})),
		productionGraphs: productionGraphs.map((graph) => ({
			name: graph.name,
			data: graph.data,
		})),
	});

	return JSON.stringify(data, null, 2);
}
