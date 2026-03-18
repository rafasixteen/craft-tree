'use server';

import db from '@/db/client';
import { itemsTable, producerInputsTable, producerOutputsTable, producersTable } from '@/db/schema';

import { Item } from '@/domain/item';
import { Producer, ProducerInput, ProducerOutput } from '@/domain/producer';
import { RecipeTreeData } from '@/domain/recipe-tree/types/recipe-tree-data';

import { inArray } from 'drizzle-orm';

export async function getRecipeTreeData(itemId: string): Promise<RecipeTreeData>
{
	const itemsResult: Item[] = [];
	const producersResult: Producer[] = [];
	const producerInputsResult: ProducerInput[] = [];
	const producerOutputsResult: ProducerOutput[] = [];

	const visitedItemIds = new Set<string>();
	let pendingItemIds = [itemId];

	while (pendingItemIds.length > 0)
	{
		const currentItemIds = pendingItemIds.filter((itemId) => !visitedItemIds.has(itemId));
		pendingItemIds = [];

		if (currentItemIds.length === 0)
		{
			continue;
		}

		currentItemIds.forEach((itemId) => visitedItemIds.add(itemId));

		// Fetch items
		const nextItems = await db.select().from(itemsTable).where(inArray(itemsTable.id, currentItemIds));
		itemsResult.push(...nextItems);

		// Fetch producers that output these items
		const nextProducerOutputs = await db
			.select()
			.from(producerOutputsTable)
			.where(inArray(producerOutputsTable.itemId, currentItemIds));
		producerOutputsResult.push(...nextProducerOutputs);

		const producerIds = nextProducerOutputs.map((output) => output.producerId);

		let nextProducers: Producer[] = [];

		if (producerIds.length > 0)
		{
			nextProducers = await db.select().from(producersTable).where(inArray(producersTable.id, producerIds));
			producersResult.push(...nextProducers);
		}

		// Fetch inputs for these producers
		let nextInputs: ProducerInput[] = [];

		if (producerIds.length > 0)
		{
			nextInputs = await db
				.select()
				.from(producerInputsTable)
				.where(inArray(producerInputsTable.producerId, producerIds));
			producerInputsResult.push(...nextInputs);
		}

		// Add input items to pending if not visited
		const nextItemIds = nextInputs.map((input) => input.itemId).filter((iid) => !visitedItemIds.has(iid));

		if (nextItemIds.length > 0)
		{
			pendingItemIds = Array.from(new Set([...pendingItemIds, ...nextItemIds]));
		}
	}

	return {
		items: itemsResult,
		producers: producersResult,
		producerInputs: producerInputsResult,
		producerOutputs: producerOutputsResult,
	};
}
