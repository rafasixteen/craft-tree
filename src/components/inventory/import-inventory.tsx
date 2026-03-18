import { Button } from '@/components/ui/button';

import { importInventory } from '@/domain/inventory';

import { uploadJson } from '@/lib/upload-json';
import { InventoryImportSchema } from '@/lib/validation';

import z from 'zod';
import { useRef } from 'react';
import { toast } from 'sonner';

export function ImportInventoryButton()
{
	const inputRef = useRef<HTMLInputElement>(null);

	async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>)
	{
		const file = e.target.files?.[0];

		if (!file)
		{
			return;
		}

		try
		{
			const data = await uploadJson(file);

			const result = InventoryImportSchema.safeParse(data);

			if (!result.success)
			{
				toast.error('Invalid inventory file');
				console.error(z.treeifyError(result.error));
				return;
			}

			const payload = await importInventory(result.data);

			toast.success(`"${payload.name}" imported successfully`);
		}
		catch
		{
			toast.error('Failed to import inventory');
		}
		finally
		{
			// Reset so the same file can be re-imported if needed.
			e.target.value = '';
		}
	}

	return (
		<>
			<input ref={inputRef} type="file" accept=".json" className="hidden" onChange={handleFileChange} />
			<Button variant="outline" onClick={() => inputRef.current?.click()}>
				Import
			</Button>
		</>
	);
}
