'use client';

import { setSearch } from '@/lib/cookies/items-query-client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar({ defaultValue = '' })
{
	const router = useRouter();
	const [value, setValue] = useState(defaultValue);

	let typingTimer: NodeJS.Timeout | null = null;

	function onInputChange(e: React.ChangeEvent<HTMLInputElement>)
	{
		setValue(e.target.value);

		if (typingTimer) clearTimeout(typingTimer);

		typingTimer = setTimeout(() =>
		{
			setSearch(e.target.value).then(() =>
			{
				router.refresh();
			});
		}, 100);
	}

	return (
		<div>
			<input value={value} onChange={onInputChange} />
		</div>
	);
}
