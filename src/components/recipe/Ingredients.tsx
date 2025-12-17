'use client';

import { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Ingredient } from '@/domain/recipe';
import { Item } from '@/domain/item';
import { Check, Pencil, Plus, Trash, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props extends React.HTMLAttributes<HTMLDivElement>
{
	initialIngredients: Ingredient[];
	onIngredientsChanged: (ingredients: Ingredient[]) => void;

	addBehaviour?: 'scroll-top' | 'scroll-bottom' | 'none';
	scroll?: 'smooth' | 'auto' | 'instant';
}

const emptyItem: Item = {
	id: '',
	name: '',
};

function createEmptyIngredient(): Ingredient
{
	return {
		id: crypto.randomUUID(),
		item: emptyItem,
		quantity: 0,
	};
}

export function Ingredients({ initialIngredients, onIngredientsChanged, addBehaviour = 'scroll-bottom', scroll = 'smooth', className, ...otherProps }: Props)
{
	const [ingredients, setIngredients] = useState<Ingredient[]>(initialIngredients);
	const [draft, setDraft] = useState<Ingredient>(createEmptyIngredient());

	const [editingId, setEditingId] = useState<string | null>(null);
	const [editDraft, setEditDraft] = useState<Ingredient | null>(null);

	const scrollRef = useRef<HTMLDivElement>(null);

	function updateItemName(value: string)
	{
		setDraft((prev) => ({
			...prev,
			item: { ...prev.item, name: value },
		}));
	}

	function updateQuantity(value: number)
	{
		setDraft((prev) => ({ ...prev, quantity: value }));
	}

	function addIngredient()
	{
		if (!draft.item.name || draft.quantity <= 0) return;

		const next = [...ingredients, draft];

		setIngredients(next);
		onIngredientsChanged(next);

		setDraft(createEmptyIngredient());

		if (addBehaviour !== 'none' && scrollRef.current)
		{
			let top = 0;

			if (addBehaviour === 'scroll-bottom')
			{
				top = scrollRef.current.scrollHeight;
			}

			setTimeout(() =>
			{
				scrollRef.current?.scrollTo({ top: top, behavior: scroll });
			}, 0);
		}
	}

	function startEdit(ingredient: Ingredient)
	{
		setEditingId(ingredient.id);
		setEditDraft({ ...ingredient });
	}

	function cancelEdit()
	{
		setEditingId(null);
		setEditDraft(null);
	}

	function saveEdit()
	{
		if (!editDraft) return;

		const next = ingredients.map((i) => (i.id === editDraft.id ? editDraft : i));

		setIngredients(next);
		onIngredientsChanged?.(next);
		cancelEdit();
	}

	function updateEditDraft(updater: (draft: Ingredient) => Ingredient)
	{
		if (!editDraft) return;
		setEditDraft(updater(editDraft));
	}

	function deleteIngredient(id: string)
	{
		const next = ingredients.filter((i) => i.id !== id);
		setIngredients(next);
		onIngredientsChanged?.(next);
	}

	const gridCols = 'grid grid-cols-3 gap-2 p-1.5';

	return (
		<div className={cn('flex flex-col', className)} {...otherProps}>
			<div className={cn(gridCols, 'font-semibold border-b')}>
				<p className="text-center">Item</p>
				<p className="text-center">Quantity</p>
				<p className="text-center">Actions</p>
			</div>

			<div className="h-full overflow-y-auto scrollbar-hide" ref={scrollRef}>
				{ingredients.map((ingredient) =>
				{
					const isEditing = ingredient.id === editingId;

					return (
						<div key={ingredient.id} className={cn(gridCols, 'items-center border-b last:border-0 hover:bg-accent/20')}>
							<div>
								<Name
									isEditing={isEditing}
									value={isEditing ? editDraft!.item.name : ingredient.item.name}
									onChange={(v) => updateEditDraft((draft) => ({ ...draft, item: { ...draft.item, name: v } }))}
								/>
							</div>
							<div>
								<Quantity
									isEditing={isEditing}
									value={isEditing ? editDraft!.quantity : ingredient.quantity}
									onChange={(v) => updateEditDraft((draft) => ({ ...draft, quantity: v }))}
								/>
							</div>
							<div className="flex gap-2 justify-center">
								<Actions
									isEditing={isEditing}
									onEdit={() => startEdit(ingredient)}
									onSave={saveEdit}
									onCancel={cancelEdit}
									onDelete={() => deleteIngredient(ingredient.id)}
								/>
							</div>
						</div>
					);
				})}
			</div>

			<div className={cn(gridCols, 'items-center border-t hover:bg-accent/20')}>
				<Input placeholder="Item name" value={draft.item.name} onChange={(e) => updateItemName(e.target.value)} />
				<Input type="number" min={0} value={draft.quantity} onChange={(e) => updateQuantity(Number(e.target.value))} />

				<div className="flex gap-2 justify-center">
					<Button onClick={addIngredient} size="icon-sm">
						<Plus />
					</Button>
				</div>
			</div>
		</div>
	);
}

interface ActionsProps
{
	isEditing: boolean;
	onEdit: () => void;
	onDelete: () => void;
	onSave: () => void;
	onCancel: () => void;
}

function Actions({ isEditing, onEdit, onDelete, onSave, onCancel }: ActionsProps)
{
	if (isEditing)
	{
		return (
			<>
				<Button size="icon-sm" onClick={onSave}>
					<Check />
				</Button>
				<Button size="icon-sm" variant="ghost" onClick={onCancel}>
					<X />
				</Button>
			</>
		);
	}
	else
	{
		return (
			<>
				<Button size="icon-sm" variant="outline" onClick={onEdit}>
					<Pencil />
				</Button>
				<Button size="icon-sm" variant="destructive" onClick={onDelete}>
					<Trash />
				</Button>
			</>
		);
	}
}

interface NameProps
{
	isEditing: boolean;
	value: string;
	onChange: (value: string) => void;
}

function Name({ isEditing, value, onChange }: NameProps)
{
	if (isEditing)
	{
		return <Input value={value} onChange={(e) => onChange(e.target.value)} />;
	}
	else
	{
		return <Input className="bg-transparent border-none focus:ring-0 pointer-events-none" value={value} readOnly />;
	}
}

interface QuantityProps
{
	isEditing: boolean;
	value: number;
	onChange: (value: number) => void;
}

export function Quantity({ isEditing, value, onChange }: QuantityProps)
{
	if (isEditing)
	{
		return <Input type="number" min={0} value={value} onChange={(e) => onChange(Number(e.target.value))} />;
	}
	else
	{
		return <Input className="bg-transparent border-none focus:ring-0 pointer-events-none" type="number" value={value} readOnly />;
	}
}
