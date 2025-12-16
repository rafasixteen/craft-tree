import prisma from '@/lib/prisma';
import { CreateNodeInput } from '@domain/node';
import { nameSchema } from '@/domain/shared';

export async function createNode(data: CreateNodeInput)
{
	const { name, type, parentId, itemId, recipeId } = data;

	if (itemId && recipeId)
	{
		throw new Error('A node can only reference either an Item or a Recipe, not both.');
	}

	const parsedName = await nameSchema.parseAsync(name);

	return prisma.node.create({
		data: {
			name: parsedName,
			type,
			parent: parentId ? { connect: { id: parentId } } : undefined,
			item: itemId ? { connect: { id: itemId } } : undefined,
			recipe: recipeId ? { connect: { id: recipeId } } : undefined,
			order: await getOrder(parentId),
		},
	});
}

async function getOrder(parentId: string | undefined)
{
	const siblingCount = await prisma.node.count({
		where: {
			parentId: parentId,
		},
	});

	return siblingCount + 1;
}
