import prisma from '@/lib/prisma';
import { Item } from '@domain/item';

export async function getItemById(id: string): Promise<Item | null>
{
	return prisma.item.findUnique({
		where: {
			id: id,
		},
	});
}
