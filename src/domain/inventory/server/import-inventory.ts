'use server';

import db from '@/db/client';
import {
	inventoriesTable,
	itemsTable,
	itemTagsTable,
	producerInputsTable,
	producerOutputsTable,
	producersTable,
	producerTagsTable,
	tagsTable,
	productionGraphsTable,
} from '@/db/schema';

import { Inventory } from '@/domain/inventory';

import { createClient } from '@/lib/supabase/server';
import { InventoryImport } from '@/lib/validation';

export async function importInventory(data: InventoryImport): Promise<Inventory>
{
	const { inventory, items, producers, tags, productionGraphs } = data;

	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user)
	{
		throw new Error('Unauthenticated');
	}

	return await db.transaction(async (tx) =>
	{
		const [newInventory] = await tx
			.insert(inventoriesTable)
			.values({
				name: inventory,
				userId: user.id,
			})
			.returning();

		const [createdItems, createdProducers, createdTags] = await Promise.all([
			items.length
				? tx
						.insert(itemsTable)
						.values(items.map((item) => ({ name: item.name, inventoryId: newInventory.id })))
						.returning()
				: Promise.resolve([]),

			producers.length
				? tx
						.insert(producersTable)
						.values(
							producers.map((producer) => ({
								name: producer.name,
								time: producer.time,
								inventoryId: newInventory.id,
							})),
						)
						.returning()
				: Promise.resolve([]),

			tags.length
				? tx
						.insert(tagsTable)
						.values(tags.map((tag) => ({ name: tag.name, inventoryId: newInventory.id })))
						.returning()
				: Promise.resolve([]),
		]);

		const producerInputValues = producers.flatMap((producer, producerIndex) =>
			producer.inputs.map((input) => ({
				producerId: createdProducers[producerIndex].id,
				itemId: createdItems[input.itemId - 1].id,
				quantity: input.quantity,
			})),
		);

		const producerOutputValues = producers.flatMap((producer, producerIndex) =>
			producer.outputs.map((output) => ({
				producerId: createdProducers[producerIndex].id,
				itemId: createdItems[output.itemId - 1].id,
				quantity: output.quantity,
			})),
		);

		const itemTagValues = items.flatMap((item, itemIndex) =>
			(item.tags ?? []).map((tagId) => ({
				itemId: createdItems[itemIndex].id,
				tagId: createdTags[tagId - 1].id,
			})),
		);

		const producerTagValues = producers.flatMap((producer, producerIndex) =>
			(producer.tags ?? []).map((tagId) => ({
				producerId: createdProducers[producerIndex].id,
				tagId: createdTags[tagId - 1].id,
			})),
		);

		const productionGraphValues = productionGraphs.map((graph) => ({
			name: graph.name,
			data: graph.data,
			inventoryId: newInventory.id,
		}));

		const secondBatch = [
			...(producerInputValues.length ? [tx.insert(producerInputsTable).values(producerInputValues)] : []),
			...(producerOutputValues.length ? [tx.insert(producerOutputsTable).values(producerOutputValues)] : []),
			...(itemTagValues.length ? [tx.insert(itemTagsTable).values(itemTagValues)] : []),
			...(producerTagValues.length ? [tx.insert(producerTagsTable).values(producerTagValues)] : []),
			...(productionGraphValues.length ? [tx.insert(productionGraphsTable).values(productionGraphValues)] : []),
		];

		if (secondBatch.length)
		{
			await Promise.all(secondBatch);
		}

		return newInventory;
	});
}
