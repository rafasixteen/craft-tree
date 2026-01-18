interface PageProps
{
	params: Promise<{
		'collection-slug': string;
		'path-segments': string[];
	}>;
}

export default async function Page({ params }: PageProps)
{
	const { 'collection-slug': collectionSlug, 'path-segments': pathSegments } = await params;

	console.log('Collection:', collectionSlug);
	console.log('Path segments:', pathSegments);

	return (
		<div>
			<h1>Collection: {collectionSlug}</h1>
			<p>Path segments: {pathSegments.join(' / ') || '(none)'}</p>
		</div>
	);
}
