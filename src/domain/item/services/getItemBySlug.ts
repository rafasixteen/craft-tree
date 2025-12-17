import prisma from '@/lib/prisma';
import { Item } from '@domain/item';

export async function getItemBySlug(slug: string): Promise<Item | null>
{
	return prisma.item.findUnique({
		where: {
			slug: slug,
		},
	});
}
