import prisma from '@/lib/prisma';
import { Item } from '@domain/item';

export async function deleteItem(id: string): Promise<Item>
{
	return prisma.item.delete({
		where: {
			id: id,
		},
	});
}
