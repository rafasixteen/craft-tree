import { Item, UpdateItemInput } from '@domain/item';
import { nameSchema } from '@domain/shared';
import prisma from '@/lib/prisma';

export async function updateItem(id: string, data: UpdateItemInput): Promise<Item>
{
	const { name } = data;

	const parsedName = name ? await nameSchema.parseAsync(name) : undefined;

	return prisma.item.update({
		where: {
			id: id,
		},
		data: {
			name: parsedName,
		},
	});
}
