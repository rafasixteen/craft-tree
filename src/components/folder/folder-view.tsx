import { Folder } from '@/domain/folder';

interface FolderViewProps
{
	folder: Folder;
}

export function FolderView({ folder }: FolderViewProps)
{
	return <div>{folder.name}</div>;
}
