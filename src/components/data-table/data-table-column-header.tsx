import { Column } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement>
{
	column: Column<TData, TValue>;
	title: string;
}

export function DataTableColumnHeader<TData, TValue>({ column, title, ...props }: DataTableColumnHeaderProps<TData, TValue>)
{
	if (!column.getCanSort())
	{
		return <div {...props}>{title}</div>;
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="sm" className="data-[state=open]:bg-accent">
					<div {...props}>{title}</div>
					{column.getIsSorted() === 'desc' ? <ArrowDown /> : column.getIsSorted() === 'asc' ? <ArrowUp /> : <ChevronsUpDown />}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start">
				<DropdownMenuItem onClick={() => column.toggleSorting(false)}>
					<ArrowUp className="size-3.5 text-muted-foreground/70" />
					Asc
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => column.toggleSorting(true)}>
					<ArrowDown className="size-3.5 text-muted-foreground/70" />
					Desc
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
					<EyeOff className="size-3.5 text-muted-foreground/70" />
					Hide
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
