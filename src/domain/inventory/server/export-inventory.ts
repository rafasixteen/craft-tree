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

	const itemExportId = (dbId: string) => items.findIndex((i) => i.id === dbId) + 1;

	const producerExportId = (dbId: string) => producers.findIndex((p) => p.id === dbId) + 1;

	const remapGraphData = (graph: (typeof productionGraphs)[number]) =>
	{
		const nodeId = (raw: string) =>
		{
			if (raw.startsWith('producer-')) return `producer-${producerExportId(raw.slice(9))}`;
			if (raw.startsWith('item-')) return `item-${itemExportId(raw.slice(5))}`;
			return raw;
		};

		const nodes = graph.data.nodes.map((node) => ({
			...node,
			id: nodeId(node.id),
			data: {
				...node.data,
				...(node.data.producerId !== undefined && {
					producerId: producerExportId(node.data.producerId),
				}),
				...(node.data.itemId !== undefined && {
					itemId: itemExportId(node.data.itemId),
				}),
				...(node.data.inputRates && {
					inputRates: node.data.inputRates.map((r) => ({
						...r,
						itemId: itemExportId(r.itemId),
					})),
				}),
				...(node.data.outputRates && {
					outputRates: node.data.outputRates.map((r) => ({
						...r,
						itemId: itemExportId(r.itemId),
					})),
				}),
			},
		}));

		const edges = graph.data.edges.map((edge) =>
		{
			const source = nodeId(edge.source);
			const target = nodeId(edge.target);
			const targetHandle = edge.targetHandle ? itemExportId(edge.targetHandle).toString() : undefined;
			const sourceHandle = edge.sourceHandle ? itemExportId(edge.sourceHandle).toString() : undefined;

			return {
				...edge,
				id: `xy-edge__${source}-${target}${targetHandle}`,
				source,
				target,
				targetHandle,
				sourceHandle,
			};
		});

		return { nodes, edges, viewport: graph.data.viewport };
	};

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
					itemId: itemExportId(input.itemId),
					quantity: input.quantity,
				})),
			outputs: producerOutputs
				.filter((output) => output.producerId === producer.id)
				.map((output) => ({
					itemId: itemExportId(output.itemId),
					quantity: output.quantity,
				})),
			tags: producerTags.filter((pt) => pt.producerId === producer.id).map((pt) => tagExportId(pt.tagId)),
		})),
		productionGraphs: productionGraphs.map((graph) => ({
			name: graph.name,
			data: remapGraphData(graph),
		})),
	});

	return JSON.stringify(data, null, 2);
}
