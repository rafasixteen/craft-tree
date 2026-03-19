import { useCallback, useState } from 'react';
import { DeleteTarget } from '@/components/confirmation-dialog';

export function useDeleteConfirm()
{
	const [target, setTarget] = useState<DeleteTarget | null>(null);
	const [resolver, setResolver] = useState<((confirmed: boolean) => void) | null>(null);

	const confirmDelete = useCallback(function confirmDelete(t: DeleteTarget): Promise<boolean>
	{
		return new Promise((resolve) =>
		{
			setTarget(t);
			setResolver(() => resolve);
		});
	}, []);

	const handleConfirm = useCallback(
		async function handleConfirm()
		{
			resolver?.(true);
			setTarget(null);
			setResolver(null);
		},
		[resolver],
	);

	const handleCancel = useCallback(
		function handleCancel()
		{
			resolver?.(false);
			setTarget(null);
			setResolver(null);
		},
		[resolver]
	);

	return { target, confirmDelete, handleConfirm, handleCancel };
}
