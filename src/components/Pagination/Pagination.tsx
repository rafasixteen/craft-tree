'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import styles from './Pagination.module.css';

interface PaginationProps
{
	currentPage: number;
	totalPages: number;
	onPageChanged(page: number): void;
}

export default function Pagination({ currentPage, totalPages, onPageChanged }: PaginationProps)
{
	const [page, setPage] = useState(currentPage);

	useEffect(() =>
	{
		setPage(currentPage);
	}, [currentPage]);

	function goToPage(newPage: number)
	{
		const clamped = Math.min(Math.max(newPage, 1), totalPages);

		setPage(clamped);
		onPageChanged(clamped);
	}

	function goToNextPage()
	{
		goToPage(page + 1);
	}

	function goToPreviousPage()
	{
		goToPage(page - 1);
	}

	return (
		<div className={styles.pagination}>
			<ChevronLeftIcon onClick={goToPreviousPage} aria-disabled={currentPage <= 1} />
			<span>
				{currentPage} / {totalPages}
			</span>
			<ChevronRightIcon onClick={goToNextPage} aria-disabled={currentPage >= totalPages} />
		</div>
	);
}
