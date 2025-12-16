import prisma from '@/lib/prisma';
import { UpdateNodeInput } from '@domain/node';
import { nameSchema } from '@/domain/shared';

export async function updateNode(id: string, data: UpdateNodeInput)
{
	const { name, parentId } = data;

	const parsedName = name ? await nameSchema.parseAsync(name) : undefined;

	return prisma.node.update({
		where: {
			id: id,
		},
		data: {
			name: parsedName,
			parent: parentId ? { connect: { id: parentId } } : undefined,
		},
	});
}
