'use client';

import { Field } from '@/components/ui/field';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';

import { FilterIcon } from 'lucide-react';
import { Table } from '@tanstack/react-table';

interface DataTableFilterProps<TData> extends Omit<React.ComponentProps<typeof InputGroupInput>, 'value' | 'onChange'>
{
	table: Table<TData>;
	filterKey: string;
}

export function DataTableFilter<TData>({ table, filterKey, ...props }: DataTableFilterProps<TData>)
{
	return (
		<Field>
			<InputGroup>
				<InputGroupInput
					value={(table.getColumn(filterKey)?.getFilterValue() as string) ?? ''}
					onChange={(event) => table.getColumn(filterKey)?.setFilterValue(event.target.value)}
					{...props}
				/>

				<InputGroupAddon align="inline-start">
					<FilterIcon className="size-3" />
				</InputGroupAddon>
			</InputGroup>
		</Field>
	);
}
