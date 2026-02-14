// Mock DB for useTags integration tests
// This mock DB will simulate basic CRUD for tags in-memory

import { Tag } from '@/domain/tag';
import { Inventory } from '@/domain/inventory';

let tags: Tag[] = [];

export function resetMockTagsDb()
{
	tags = [];
}

export function mockGetTags({ inventoryId }: { inventoryId: Inventory['id'] }): Tag[]
{
	return tags.filter((tag) => tag.inventoryId === inventoryId);
}

export function mockCreateTag({ name, inventoryId }: { name: string; inventoryId: Inventory['id'] }): Tag
{
	const newTag: Tag = {
		id: crypto.randomUUID(),
		name,
		inventoryId,
	};
	tags.push(newTag);
	return newTag;
}

export function mockDeleteTag({ tagId }: { tagId: Tag['id'] })
{
	tags = tags.filter((tag) => tag.id !== tagId);
}
