import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTags } from '@/domain/tag/hooks/use-tags';
import { resetMockTagsDb, mockGetTags, mockCreateTag, mockDeleteTag } from './mock-tags-db';

vi.mock('@/domain/tag/server', () => ({
	createTag: vi.fn(),
	deleteTag: vi.fn(),
}));
vi.mock('@/domain/tag', async () =>
{
	const actual = await vi.importActual<any>('@/domain/tag');
	return {
		...actual,
		getTags: vi.fn(),
	};
});

describe('useTags integration', () =>
{
	const inventoryId = 'test-inventory';
	let TagServerActions: typeof import('@/domain/tag/server');
	let TagDomain: typeof import('@/domain/tag');

	beforeEach(async () =>
	{
		resetMockTagsDb();
		TagServerActions = await import('@/domain/tag/server');
		TagDomain = await import('@/domain/tag');
		(TagDomain.getTags as any).mockImplementation(mockGetTags);
		(TagServerActions.createTag as any).mockImplementation(mockCreateTag);
		(TagServerActions.deleteTag as any).mockImplementation(mockDeleteTag);
	});

	it('should start with no tags', async () =>
	{
		const { result } = renderHook(() => useTags(inventoryId));
		expect(result.current.tags).toEqual([]);
	});

	it('should create a tag', async () =>
	{
		const { result } = renderHook(() => useTags(inventoryId));
		await act(async () =>
		{
			await result.current.createTag('Red');
		});
		expect(result.current.tags.length).toBe(1);
		expect(result.current.tags[0].name).toBe('Red');
	});

	it('should delete a tag', async () =>
	{
		const { result } = renderHook(() => useTags(inventoryId));
		// Create tag
		await act(async () =>
		{
			await result.current.createTag('Blue');
		});
		const tagId = result.current.tags[0].id;
		// Delete tag
		await act(async () =>
		{
			await result.current.deleteTag(tagId);
		});
		expect(result.current.tags).toEqual([]);
	});

	it('should handle multiple creates and deletes', async () =>
	{
		const { result } = renderHook(() => useTags(inventoryId));
		// Create multiple tags
		await act(async () =>
		{
			await result.current.createTag('Green');
			await result.current.createTag('Yellow');
			await result.current.createTag('Purple');
		});
		expect(result.current.tags.length).toBe(3);
		expect(result.current.tags.map((t) => t.name).sort()).toEqual(['Green', 'Purple', 'Yellow']);

		// Delete the middle tag (Yellow)
		const yellow = result.current.tags.find((t) => t.name === 'Yellow');
		await act(async () =>
		{
			await result.current.deleteTag(yellow!.id);
		});
		expect(result.current.tags.length).toBe(2);
		expect(result.current.tags.map((t) => t.name).sort()).toEqual(['Green', 'Purple']);

		// Delete all remaining
		await act(async () =>
		{
			for (const tag of [...result.current.tags])
			{
				await result.current.deleteTag(tag.id);
			}
		});
		expect(result.current.tags).toEqual([]);
	});

	it('should support interleaved create and delete', async () =>
	{
		const { result } = renderHook(() => useTags(inventoryId));
		// Create one
		await act(async () =>
		{
			await result.current.createTag('Silver');
		});
		expect(result.current.tags.length).toBe(1);

		// Create another, then delete the first
		const firstId = result.current.tags[0].id;
		await act(async () =>
		{
			await result.current.createTag('Gold');
			await result.current.deleteTag(firstId);
		});
		expect(result.current.tags.length).toBe(1);
		expect(result.current.tags[0].name).toBe('Gold');
	});
});
