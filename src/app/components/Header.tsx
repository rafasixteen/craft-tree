'use client';

import { useRouter } from 'next/navigation';

export default function Header()
{
	const router = useRouter();

	return (
		<header className="header">
			Craft Tree Header
			<button onClick={() => router.push('/items')}>Items</button>
		</header>
	);
}
