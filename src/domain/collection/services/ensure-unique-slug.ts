'use server';

import { slugify } from '@/lib/utils';
import { collectionsTable } from '@/db/schema';
import { like } from 'drizzle-orm';
import db from '@/db/client';

export async function ensureUniqueSlug(name: string): Promise<string>
{
	const baseSlug = slugify(name);

	const rows = await db
		.select({ slug: collectionsTable.slug })
		.from(collectionsTable)
		.where(like(collectionsTable.slug, `${baseSlug}%`));

	if (rows.length === 0)
	{
		return baseSlug;
	}

	const used = new Set(rows.map((r) => r.slug));

	if (!used.has(baseSlug))
	{
		return baseSlug;
	}

	let suffix = 1;

	while (used.has(`${baseSlug}-${suffix}`))
	{
		suffix++;
	}

	return `${baseSlug}-${suffix}`;
}
