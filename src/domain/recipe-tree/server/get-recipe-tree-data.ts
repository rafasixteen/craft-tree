'use server';

import { inArray } from 'drizzle-orm';
import { items, producers, producerInputs, producerOutputs } from '@/db/schema';
import { Item } from '@/domain/item';
import { Producer, ProducerInput, ProducerOutput } from '@/domain/producer';
import { RecipeTreeData } from '@/domain/recipe-tree/types/recipe-tree-data';
import db from '@/db/client';

export async function getRecipeTreeData(
	itemId: string,
): Promise<RecipeTreeData>
{
	const itemsResult: Item[] = [];
	const producersResult: Producer[] = [];
	const producerInputsResult: ProducerInput[] = [];
	const producerOutputsResult: ProducerOutput[] = [];

	const visitedItemIds = new Set<string>();
	let pendingItemIds = [itemId];

	while (pendingItemIds.length > 0)
	{
		const currentItemIds = pendingItemIds.filter(
			(itemId) => !visitedItemIds.has(itemId),
		);
		pendingItemIds = [];

		if (currentItemIds.length === 0)
		{
			continue;
		}

		currentItemIds.forEach((itemId) => visitedItemIds.add(itemId));

		// Fetch items
		const nextItems = await db
			.select()
			.from(items)
			.where(inArray(items.id, currentItemIds));
		itemsResult.push(...nextItems);

		// Fetch producers that output these items
		const nextProducerOutputs = await db
			.select()
			.from(producerOutputs)
			.where(inArray(producerOutputs.itemId, currentItemIds));
		producerOutputsResult.push(...nextProducerOutputs);

		const producerIds = nextProducerOutputs.map(
			(output) => output.producerId,
		);

		let nextProducers: Producer[] = [];

		if (producerIds.length > 0)
		{
			nextProducers = await db
				.select()
				.from(producers)
				.where(inArray(producers.id, producerIds));
			producersResult.push(...nextProducers);
		}

		// Fetch inputs for these producers
		let nextInputs: ProducerInput[] = [];

		if (producerIds.length > 0)
		{
			nextInputs = await db
				.select()
				.from(producerInputs)
				.where(inArray(producerInputs.producerId, producerIds));
			producerInputsResult.push(...nextInputs);
		}

		// Add input items to pending if not visited
		const nextItemIds = nextInputs
			.map((input) => input.itemId)
			.filter((iid) => !visitedItemIds.has(iid));

		if (nextItemIds.length > 0)
		{
			pendingItemIds = Array.from(
				new Set([...pendingItemIds, ...nextItemIds]),
			);
		}
	}

	return {
		items: itemsResult,
		producers: producersResult,
		producerInputs: producerInputsResult,
		producerOutputs: producerOutputsResult,
	};
}
