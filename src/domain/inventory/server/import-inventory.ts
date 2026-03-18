'use server';

import db from '@/db/client';
import { inventoriesTable, itemsTable, producerInputsTable, producerOutputsTable, producersTable } from '@/db/schema';

import { Inventory } from '@/domain/inventory';

import { createClient } from '@/lib/supabase/server';
import { InventoryImport } from '@/lib/validation';

export async function importInventory(data: InventoryImport): Promise<Inventory>
{
	const { inventory, items, producers } = data;

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

		const createdItems = await tx
			.insert(itemsTable)
			.values(
				items.map((item) => ({
					name: item.name,
					inventoryId: newInventory.id,
				})),
			)
			.returning();

		const createdProducers = await tx
			.insert(producersTable)
			.values(
				producers.map((producer) => ({
					name: producer.name,
					time: producer.time,
					inventoryId: newInventory.id,
				})),
			)
			.returning();

		await tx.insert(producerInputsTable).values(
			producers.flatMap((producer, producerIndex) =>
				producer.inputs.map((input) => ({
					producerId: createdProducers[producerIndex].id,
					itemId: createdItems[input.itemId - 1].id,
					quantity: input.quantity,
				})),
			),
		);

		await tx.insert(producerOutputsTable).values(
			producers.flatMap((producer, producerIndex) =>
				producer.outputs.map((output) => ({
					producerId: createdProducers[producerIndex].id,
					itemId: createdItems[output.itemId - 1].id,
					quantity: output.quantity,
				})),
			),
		);

		return newInventory;
	});
}
