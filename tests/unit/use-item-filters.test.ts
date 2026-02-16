import { renderHook, act } from '@testing-library/react';
import { useItemFilters } from '../../src/domain/item/hooks/use-item-filters';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import * as nextNavigation from 'next/navigation';

// Mock next/navigation
vi.mock('next/navigation');

describe('useItemFilters', () =>
{
	let searchParamsMock: any;
	let routerPushMock: any;

	beforeEach(() =>
	{
		searchParamsMock = {
			get: vi.fn(),
			toString: vi.fn(),
		};
		routerPushMock = vi.fn();
		const routerMock = {
			push: routerPushMock,
			back: vi.fn(),
			forward: vi.fn(),
			refresh: vi.fn(),
			replace: vi.fn(),
			prefetch: vi.fn(),
		};
		vi.spyOn(nextNavigation, 'useSearchParams').mockReturnValue(searchParamsMock);
		vi.spyOn(nextNavigation, 'useRouter').mockReturnValue(routerMock);
	});

	it('setSearchTerm updates only search param', () =>
	{
		searchParamsMock.get.mockImplementation((key: string) =>
		{
			if (key === 'search') return 'old';
			if (key === 'tags') return 'tag1,tag2';
			return null;
		});
		searchParamsMock.toString.mockReturnValue('search=old&tags=tag1,tag2');

		const { result } = renderHook(() => useItemFilters());
		act(() =>
		{
			result.current.setSearchTerm('new');
		});
		expect(routerPushMock).toHaveBeenCalledWith('?search=new&tags=tag1%2Ctag2');
	});

	it('setTags updates only tags param', () =>
	{
		searchParamsMock.get.mockImplementation((key: string) =>
		{
			if (key === 'search') return 'old';
			if (key === 'tags') return 'tag1,tag2';
			return null;
		});
		searchParamsMock.toString.mockReturnValue('search=old&tags=tag1,tag2');

		const { result } = renderHook(() => useItemFilters());
		act(() =>
		{
			result.current.setTags(['tag3']);
		});
		expect(routerPushMock).toHaveBeenCalledWith('?search=old&tags=tag3');
	});

	it('setSearchTerm removes search param when null', () =>
	{
		searchParamsMock.get.mockImplementation((key: string) =>
		{
			if (key === 'search') return 'old';
			if (key === 'tags') return 'tag1,tag2';
			return null;
		});
		searchParamsMock.toString.mockReturnValue('search=old&tags=tag1,tag2');

		const { result } = renderHook(() => useItemFilters());
		act(() =>
		{
			result.current.setSearchTerm(null);
		});
		expect(routerPushMock).toHaveBeenCalledWith('?tags=tag1%2Ctag2');
	});

	it('setTags removes tags param when null', () =>
	{
		searchParamsMock.get.mockImplementation((key: string) =>
		{
			if (key === 'search') return 'old';
			if (key === 'tags') return 'tag1,tag2';
			return null;
		});
		searchParamsMock.toString.mockReturnValue('search=old&tags=tag1,tag2');

		const { result } = renderHook(() => useItemFilters());
		act(() =>
		{
			result.current.setTags(null);
		});
		expect(routerPushMock).toHaveBeenCalledWith('?search=old');
	});
});
