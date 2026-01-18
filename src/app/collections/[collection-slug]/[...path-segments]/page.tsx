interface PageProps
{
	params: Promise<{ 'collection-slug': string; 'path-segments': string[] }>;
}

export default async function Page({ params }: PageProps)
{
	const { 'path-segments': pathSegments, 'collection-slug': collectionSlug } = await params;

	return (
		<p>
			Item Page: {pathSegments.join('/')} at {collectionSlug}
		</p>
	);
}
