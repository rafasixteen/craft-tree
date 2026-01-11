'use server';

import { slugify } from '@/lib/utils';
import { getCollectionBySlug } from './get-collection-by-slug';

export async function ensureUniqueSlug(name: string): Promise<string>
{
	let slug = slugify(name);
	let suffix = 1;

	let existingCollection = await getCollectionBySlug(slug);

	while (existingCollection)
	{
		const newSlug = `${slug}-${suffix}`;
		existingCollection = await getCollectionBySlug(newSlug);

		if (!existingCollection)
		{
			slug = newSlug;
			break;
		}

		suffix++;
	}

	return slug;
}
