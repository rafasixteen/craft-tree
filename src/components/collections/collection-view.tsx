import { Collection } from '@/domain/collection';

interface CollectionViewProps
{
	collection: Collection;
}

export function CollectionView({ collection }: CollectionViewProps)
{
	return <div>{collection.name}</div>;
}
