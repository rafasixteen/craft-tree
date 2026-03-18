import { Column } from '@tanstack/react-table';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from '@/components/ui/command';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';

interface Option
{
	label: string;
	value: string;
}

interface DataTableFacetedFilterProps<TData, TValue>
{
	column?: Column<TData, TValue>;
	title: string;
	options: Option[];
	trigger: React.ReactNode;
}

export function DataTableFacetedFilter<TData, TValue>({
	column,
	title,
	options,
	trigger,
}: DataTableFacetedFilterProps<TData, TValue>)
{
	const facets = column?.getFacetedUniqueValues();
	const selectedValues = new Set(column?.getFilterValue() as string[]);

	return (
		<Popover>
			<PopoverTrigger asChild>{trigger}</PopoverTrigger>
			<PopoverContent className="p-0" align="start">
				<Command>
					<CommandInput placeholder={title} />
					<CommandList>
						<CommandEmpty>No results found.</CommandEmpty>
						<CommandGroup>
							{options.map((option) =>
							{
								const isSelected = selectedValues.has(
									option.value,
								);

								return (
									<CommandItem
										key={option.value}
										onSelect={() =>
										{
											if (isSelected)
											{
												selectedValues.delete(
													option.value,
												);
											}
											else
											{
												selectedValues.add(
													option.value,
												);
											}

											const filterValues =
												Array.from(selectedValues);
											column?.setFilterValue(
												filterValues.length
													? filterValues
													: undefined,
											);
										}}
									>
										<div
											className={cn(
												'mr-2 flex size-4 items-center justify-center rounded-sm border',
												isSelected
													? 'bg-primary text-primary-foreground'
													: 'opacity-50 [&_svg]:invisible',
											)}
										>
											<Check />
										</div>
										<span>{option.label}</span>
										{facets?.get(option.value) && (
											<span className="ml-auto flex size-4 items-center justify-center font-mono text-xs">
												{facets.get(option.value)}
											</span>
										)}
									</CommandItem>
								);
							})}
						</CommandGroup>
						{selectedValues.size > 0 && (
							<>
								<CommandSeparator />
								<CommandGroup>
									<CommandItem
										onSelect={() =>
											column?.setFilterValue(undefined)
										}
										className="justify-center text-center"
									>
										Clear filters
									</CommandItem>
								</CommandGroup>
							</>
						)}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
