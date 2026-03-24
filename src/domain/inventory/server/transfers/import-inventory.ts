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

		const itemsValues = items.map((item) => ({
			id: item.id,
			name: item.name,
			inventoryId: newInventory.id,
		}));

		const producersValues = producers.map((producer) => ({
			id: producer.id,
			name: producer.name,
			time: producer.time,
			inventoryId: newInventory.id,
		}));

		const tagsValues = tags.map((tag) => ({
			id: tag.id,
			name: tag.name,
			inventoryId: newInventory.id,
		}));

		const producerInputValues = producers.flatMap((producer) =>
			producer.inputs.map((input) => ({
				producerId: producer.id,
				itemId: input.itemId,
				quantity: input.quantity,
			})),
		);

		const producerOutputValues = producers.flatMap((producer) =>
			producer.outputs.map((output) => ({
				producerId: producer.id,
				itemId: output.itemId,
				quantity: output.quantity,
			})),
		);

		const itemTagValues = items.flatMap((item) =>
			item.tags.map((tagId) => ({
				itemId: item.id,
				tagId: tagId,
			})),
		);

		const producerTagValues = producers.flatMap((producer) =>
			producer.tags.map((tagId) => ({
				producerId: producer.id,
				tagId: tagId,
			})),
		);

		const productionGraphValues = productionGraphs.map((graph) => ({
			name: graph.name,
			data: graph.data,
			inventoryId: newInventory.id,
		}));

		if (itemsValues.length > 0)
		{
			tx.insert(itemsTable).values(itemsValues);
		}

		if (producersValues.length > 0)
		{
			tx.insert(producersTable).values(producersValues);
		}

		if (tagsValues.length > 0)
		{
			tx.insert(tagsTable).values(tagsValues);
		}

		if (producerInputValues.length > 0)
		{
			tx.insert(producerInputsTable).values(producerInputValues);
		}

		if (producerOutputValues.length > 0)
		{
			tx.insert(producerOutputsTable).values(producerOutputValues);
		}

		if (itemTagValues.length > 0)
		{
			tx.insert(itemTagsTable).values(itemTagValues);
		}

		if (producerTagValues.length > 0)
		{
			tx.insert(producerTagsTable).values(producerTagValues);
		}

		if (productionGraphValues.length > 0)
		{
			tx.insert(productionGraphsTable).values(productionGraphValues);
		}

		return newInventory;
	});
}
