'use server';

import { getInventoryById, Inventory } from '@/domain/inventory';
import { items as itemsTable, producers as producersTable, producerInputs as producerInputsTable, producerOutputs as prodproducerOutputsTable } from '@/db/schema';
import { eq, inArray } from 'drizzle-orm';
import db from '@/db/client';

export async function exportInventory(inventoryId: Inventory['id'])
{
	const inventory = await getInventoryById(inventoryId);

	const items = await db.select().from(itemsTable).where(eq(itemsTable.inventoryId, inventoryId));
	const producers = await db.select().from(producersTable).where(eq(producersTable.inventoryId, inventoryId));

	const producerInputs = await db
		.select()
		.from(producerInputsTable)
		.where(
			inArray(
				producerInputsTable.producerId,
				producers.map((p) => p.id),
			),
		);

	const producerOutputs = await db
		.select()
		.from(prodproducerOutputsTable)
		.where(
			inArray(
				prodproducerOutputsTable.producerId,
				producers.map((p) => p.id),
			),
		);

	return JSON.stringify(
		{
			inventory: inventory.name,
			exportedAt: new Date().toISOString(),
			items: items.map((item, index) => ({
				id: index + 1,
				name: item.name,
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
			})),
		},
		null,
		2,
	);
}
