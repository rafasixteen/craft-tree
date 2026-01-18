type UniqueSlugOperation<T> = (slug: string) => Promise<T>;

export async function withUniqueSlugRetry<T>(baseSlug: string, operation: UniqueSlugOperation<T>): Promise<T>
{
	let suffix = 0;

	while (true)
	{
		const slug = suffix === 0 ? baseSlug : `${baseSlug}-${suffix}`;

		try
		{
			return await operation(slug);
		}
		catch (error: any)
		{
			// Postgres unique constraint violation
			if (error.cause.code === '23505')
			{
				suffix++;
				continue;
			}

			throw error;
		}
	}
}
