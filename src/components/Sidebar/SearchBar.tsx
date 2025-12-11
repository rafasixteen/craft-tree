import { CircleXIcon, Search } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { SidebarGroup, SidebarGroupContent } from '@/components/ui/sidebar';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { cn } from '@/lib/utils';
import { Button } from '@components/ui/button';

interface SearchBarProps
{
	value: string;
	onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps)
{
	function clearSearch()
	{
		onChange('');
	}

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

					<InputGroupInput id="search" placeholder="Search..." value={value} onChange={(e) => onChange(e.target.value)} />

					<InputGroupAddon align="inline-end">
						<Button variant="ghost" size="icon" onClick={clearSearch} className={cn(!value && 'invisible', 'hover:bg-transparent!')}>
							<CircleXIcon />
						</Button>
					</InputGroupAddon>
				</InputGroup>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
