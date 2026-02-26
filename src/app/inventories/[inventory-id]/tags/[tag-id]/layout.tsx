import { getTagById } from '@/domain/tag';
import { SWRConfig, unstable_serialize } from 'swr';

interface Params
{
	'tag-id': string;
}

interface TagLayoutProps
{
	params: Promise<Params>;
	children: React.ReactNode;
}

export default async function TagLayout({ params, children }: TagLayoutProps)
{
	const { 'tag-id': tagId } = await params;

	return (
		<SWRConfig
			value={{
				fallback: {
					[unstable_serialize(['tag', tagId])]: getTagById(tagId),
				},
			}}
		>
			{children}
		</SWRConfig>
	);
}
