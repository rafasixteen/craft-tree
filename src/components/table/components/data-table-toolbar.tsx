'use client';

import { Table } from '@tanstack/react-table';
import { Settings2, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTableViewOptions } from './data-table-view-options';
import { priorities, statuses } from '../data/data';
import { DataTableFacetedFilter } from './data-table-faceted-filter';

interface DataTableToolbarProps<TData>
{
	table: Table<TData>;
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>)
{
	const isFiltered = table.getState().columnFilters.length > 0;

	return (
		<div className="flex items-center justify-between">
			<div className="flex flex-1 items-center space-x-2">
				<Input
					placeholder="Filter tasks..."
					value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
					onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
					className="h-8 w-[150px] lg:w-[250px]"
				/>
				{/* {table.getColumn('status') && <DataTableFacetedFilter column={table.getColumn('status')} title="Status" options={statuses} />}
				{table.getColumn('priority') && <DataTableFacetedFilter column={table.getColumn('priority')} title="Priority" options={priorities} />} */}
				{isFiltered && (
					<Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3">
						Reset
						<X />
					</Button>
				)}
			</div>
			<DataTableViewOptions table={table} />
			<Button variant="default" size="sm" className="ml-auto hidden h-8 lg:flex">
				Add Task
			</Button>
		</div>
	);
}
