'use client';

interface PaginationProps
{
	page: number;
	onPageChange: (page: number) => void;
	hasNext: boolean;
}

export default function Pagination({ page, onPageChange, hasNext }: PaginationProps)
{
	return (
		<div className="flex justify-center gap-4 mt-4">
			<button
				disabled={page === 0}
				onClick={() => onPageChange(page - 1)}
				className="p-2 bg-gray-300 rounded disabled:opacity-50"
			>
				◀
			</button>
			<span>Page {page + 1}</span>
			<button
				disabled={!hasNext}
				onClick={() => onPageChange(page + 1)}
				className="p-2 bg-gray-300 rounded disabled:opacity-50"
			>
				▶
			</button>
		</div>
	);
}
