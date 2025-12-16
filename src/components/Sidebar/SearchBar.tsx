'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CircleXIcon, Search } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { SidebarGroup, SidebarGroupContent } from '@/components/ui/sidebar';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { cn } from '@/lib/utils';
import { Button } from '@components/ui/button';

interface SearchBarProps
{
	initialValue?: string;
}

export default function SearchBar({ initialValue = '' }: SearchBarProps)
{
	const [value, setValue] = useState(initialValue);

	const router = useRouter();
	const searchParams = useSearchParams();

	function updateSearch(value: string)
	{
		setValue(value);

		const params = new URLSearchParams(searchParams.toString());
		value ? params.set('search', value) : params.delete('search');
		router.replace(`${window.location.pathname}?${params.toString()}`);
	}

	useEffect(() =>
	{
		setValue(searchParams.get('search') ?? '');
	}, [searchParams]);

	return (
		<SidebarGroup className="p-0">
			<SidebarGroupContent className="relative">
				<Label htmlFor="search" className="sr-only">
					Search
				</Label>

				<InputGroup>
					<InputGroupAddon align="inline-start">
						<Search className="size-4 text-muted-foreground" />
					</InputGroupAddon>

					<InputGroupInput id="search" placeholder="Search..." value={value} onChange={(e) => updateSearch(e.target.value)} />

					<InputGroupAddon align="inline-end">
						<Button variant="ghost" size="icon" onClick={() => updateSearch('')} className={cn(!value && 'invisible', 'hover:bg-transparent!')}>
							<CircleXIcon />
						</Button>
					</InputGroupAddon>
				</InputGroup>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
