'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SearchBar({ search }: { search: string })
{
	const router = useRouter();
	const params = useSearchParams();

	const [value, setValue] = useState(search);
	const [debouncedValue, setDebouncedValue] = useState(search);

	useEffect(() =>
	{
		const timer = setTimeout(() => setDebouncedValue(value), 300);
		return () => clearTimeout(timer);
	}, [value]);

	useEffect(() =>
	{
		if (debouncedValue === search) return;

		const newParams = new URLSearchParams(params.toString());
		newParams.set('search', debouncedValue);
		newParams.set('page', '1');

		router.push(`?${newParams.toString()}`);
	}, [debouncedValue, params, router, search]);

	useEffect(() => setValue(search), [search]);

	return (
		<input
			className="border p-2 w-full"
			value={value}
			onChange={(e) => setValue(e.target.value)}
			placeholder="Search..."
		/>
	);
}
