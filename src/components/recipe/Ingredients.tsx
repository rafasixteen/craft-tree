'use client';

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Ingredient } from '@/domain/recipe';
import { Item } from '@/domain/item';
import { Check, Pencil, Plus, Trash, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import slugify from 'slugify';
import { getItemBySlug } from '@/lib/graphql/items';

interface Props extends React.HTMLAttributes<HTMLDivElement>
{
	initialIngredients: Ingredient[];
	onIngredientsChanged: (ingredients: Ingredient[]) => void;

	addBehaviour?: 'scroll-top' | 'scroll-bottom' | 'none';
	scroll?: 'smooth' | 'auto' | 'instant';
}

function createEmptyIngredient(): Ingredient
{
	const emptyItem: Item = {
		id: '',
		name: '',
	};

	// This id is fine, they are just for representation.
	// When saving to the database, this id is never used.

	return {
		id: crypto.randomUUID(),
		item: emptyItem,
		quantity: 0,
	};
}

export function Ingredients({ initialIngredients, onIngredientsChanged, addBehaviour = 'scroll-bottom', scroll = 'smooth', className, ...otherProps }: Props)
{
	const [ingredients, setIngredients] = useState<Ingredient[]>(initialIngredients);
	const [itemStatus, setItemStatus] = useState<Record<string, boolean>>({});
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

	async function addIngredient()
	{
		if (!draft.item.name)
		{
			alert('Please provide a name for the item.');
			return;
		}

		const itemSlug = slugify(draft.item.name, { lower: true });
		const item = await getItemBySlug(itemSlug, {
			id: true,
			name: true,
		});

		if (!item)
		{
			alert(`Item '${draft.item.name}' does not exist!`);
			return;
		}

		if (draft.quantity <= 0)
		{
			alert('Please provide a quantity greater than 0.');
			return;
		}

		const newIngredient = {
			...draft,
			item: item,
		};

		const next = [...ingredients, newIngredient];

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

	async function saveEdit()
	{
		if (!editDraft) return;

		const itemSlug = slugify(draft.item.name, { lower: true });
		const item = await getItemBySlug(itemSlug, {
			id: true,
			name: true,
		});

		if (!item)
		{
			alert(`Item '${editDraft.item.name}' does not exist!`);
			return;
		}

		const updatedIngredient = {
			...editDraft,
			item,
		};

		const next = ingredients.map((i) => (i.id === updatedIngredient.id ? updatedIngredient : i));

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

	useEffect(() =>
	{
		ingredients.forEach(async (ingredient) =>
		{
			const itemName = ingredient.item.name;
			const itemSlug = slugify(itemName, { lower: true });

			const item = await getItemBySlug(itemSlug, {
				name: true,
			});

			setItemStatus((prev) => ({
				...prev,
				[itemName]: item !== null,
			}));
		});
	}, [ingredients]);

	const gridCols = 'grid grid-cols-3 gap-2 p-1.5';

	return (
		<div className={cn('flex flex-col flex-1 min-h-0 h-full', className)} {...otherProps}>
			<div className={cn(gridCols, 'font-semibold border-b')}>
				<p className="text-center">Item</p>
				<p className="text-center">Quantity</p>
				<p className="text-center">Actions</p>
			</div>

			<div className="flex-1 overflow-y-auto scrollbar-hide" ref={scrollRef}>
				{ingredients.map((ingredient) =>
				{
					const isEditing = ingredient.id === editingId;
					const itemExists = itemStatus[ingredient.item.name];

					return (
						<div key={ingredient.id} className={cn(gridCols, 'items-center border-b last:border-0', itemExists ? 'hover:bg-accent/20' : 'opacity-50')}>
							<div>
								<Name
									isEditing={isEditing}
									value={isEditing ? editDraft!.item.name : ingredient.item.name}
									onNameChanged={(v) => updateEditDraft((draft) => ({ ...draft, item: { ...draft.item, name: v } }))}
								/>
							</div>
							<div>
								<Quantity
									isEditing={isEditing}
									value={isEditing ? editDraft!.quantity : ingredient.quantity}
									onQuantityChanged={(v) => updateEditDraft((draft) => ({ ...draft, quantity: v }))}
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
				<Name isEditing={true} placeholder="Item name" value={draft.item.name} onNameChanged={updateItemName} />
				<Quantity isEditing={true} value={draft.quantity} onQuantityChanged={updateQuantity} />

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

interface NameProps extends React.ComponentProps<typeof Input>
{
	isEditing: boolean;
	value: string;
	onNameChanged: (value: string) => void;
}

function Name({ isEditing, value, onNameChanged, ...props }: NameProps)
{
	if (isEditing)
	{
		return <Input value={value} onChange={(e) => onNameChanged(e.target.value)} {...props} />;
	}
	else
	{
		return <Input className="bg-transparent border-none focus:ring-0 pointer-events-none" value={value} readOnly {...props} />;
	}
}

interface QuantityProps extends React.ComponentProps<typeof Input>
{
	isEditing: boolean;
	value: number;
	onQuantityChanged: (value: number) => void;
}

export function Quantity({ isEditing, value, onQuantityChanged, ...props }: QuantityProps)
{
	if (isEditing)
	{
		return <Input type="number" min={0} value={value} onChange={(e) => onQuantityChanged(Number(e.target.value))} {...props} />;
	}
	else
	{
		return <Input className="bg-transparent border-none focus:ring-0 pointer-events-none" type="number" value={value} readOnly {...props} />;
	}
}
