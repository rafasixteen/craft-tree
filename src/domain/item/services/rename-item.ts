'use server';

import { itemsTable } from '@/db/schema';
import { Item } from '@/domain/item';
import { slugify } from '@/lib/utils';
import { nameSchema, withUniqueSlugRetry } from '@/domain/shared';
import { eq } from 'drizzle-orm';
import db from '@/db/client';

interface RenameItemArgs
{
	itemId: string;
	newName: string;
}

export async function renameItem({ itemId, newName }: RenameItemArgs): Promise<Item>
{
	const parsedName = await nameSchema.parseAsync(newName);
	const baseSlug = slugify(parsedName);

	return withUniqueSlugRetry(baseSlug, async (slug) =>
	{
		const [updated] = await db.update(itemsTable).set({ name: parsedName, slug }).where(eq(itemsTable.id, itemId)).returning();
		return updated;
	});
}
