import { FilterIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import React from 'react';

interface SearchBarProps extends React.ComponentProps<typeof Input>
{
	dummy?: boolean;
}

export function SearchBar({ ...props }: SearchBarProps)
{
	const { value, ...otherProps } = props;

	return (
		<div className="relative">
			<Input {...otherProps} value={value} />
			<div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
				<FilterIcon aria-hidden="true" className="size-4" />
			</div>
		</div>
	);
}
