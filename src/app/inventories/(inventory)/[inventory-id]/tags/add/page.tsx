'use client';

import { Header } from '@/components/sidebar';
import { useCurrentInventory } from '@/components/inventory';
import { TagForm, TagFormValues, tagFormSchema } from '@/components/tag';

import { Field } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import { createTag } from '@/domain/tag';

import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useCallback, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

export default function TagAddPage()
{
	const router = useRouter();
	const inventory = useCurrentInventory();

	const [isCreating, startTransition] = useTransition();

	const form = useForm<TagFormValues>({
		resolver: zodResolver(tagFormSchema),
		mode: 'onChange',
		defaultValues: {
			name: '',
		},
	});

	const onSubmit = useCallback(
		async function onSubmit(values: TagFormValues)
		{
			startTransition(async () =>
			{
				try
				{
					const { name } = values;

					await createTag({
						name: name,
						inventoryId: inventory.id,
					});

					toast.success(`Tag '${name}' created`);

					form.reset();
				}
				catch
				{
					toast.error('Failed to create tag');
				}
			});
		},
		[inventory.id, form, router],
	);

	return (
		<div className="flex h-screen flex-col">
			<Header />
			<Card className="flex min-h-0 flex-1 flex-col bg-transparent ring-0">
				<CardHeader>
					<CardTitle>Add Tag</CardTitle>
					<CardDescription>Add a new tag to this inventory.</CardDescription>
				</CardHeader>
				<CardContent className="flex min-h-0 flex-1 flex-col">
					<TagForm id="add-tag-form" form={form} onSubmit={onSubmit} />
				</CardContent>
				<CardFooter>
					<Field orientation="horizontal" className="flex w-full flex-row items-center justify-end gap-2">
						<Button type="button" variant="secondary" onClick={() => router.back()} className="flex-1">
							Cancel
						</Button>
						<Button
							type="submit"
							form="add-tag-form"
							disabled={isCreating || !form.formState.isValid}
							className="flex-1"
						>
							{isCreating ? 'Creating...' : 'Create'}
						</Button>
					</Field>
				</CardFooter>
			</Card>
		</div>
	);
}
