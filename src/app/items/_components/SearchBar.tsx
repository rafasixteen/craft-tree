'use client';
import { useState, useEffect } from 'react';

interface SearchBarProps
{
	value: string;
	onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps)
{
	const [input, setInput] = useState(value);

	useEffect(() =>
	{
		const timer = setTimeout(() => onChange(input), 300);
		return () => clearTimeout(timer);
	}, [input]);

	return (
		<input
			type="text"
			value={input}
			placeholder="Search items..."
			onChange={(e) => setInput(e.target.value)}
			className="border p-2 rounded w-full"
		/>
	);
}
