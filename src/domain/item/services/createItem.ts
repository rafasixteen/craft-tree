import { CreateItemInput } from '@/domain/item';
import { nameSchema } from '@/domain/shared';
import prisma from '@/lib/prisma';

export async function createItem(data: CreateItemInput)
{
	const { name } = data;

	const parsedName = await nameSchema.parseAsync(name);

	return prisma.item.create({
		data: {
			name: parsedName,
		},
	});
}
