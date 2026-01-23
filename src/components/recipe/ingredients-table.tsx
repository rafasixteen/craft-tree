import { Ingredient } from '@/domain/ingredient';
import { Recipe } from '@/domain/recipe';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Field, FieldLabel } from '@/components/ui/field';
import { useTreeNodes } from '@/providers';
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from '@/components/ui/combobox';
import { Node } from '@/domain/tree';
import { XIcon } from 'lucide-react';

interface IngredientsTableProps
{
	ingredients: Ingredient[];
	recipe?: Recipe;
	onIngredientsChange?: (ingredients: Ingredient[]) => void;
}

export function IngredientsTable({ ingredients, recipe, onIngredientsChange }: IngredientsTableProps)
{
	const { nodes } = useTreeNodes();

	const editMode = onIngredientsChange !== undefined && recipe !== undefined;

	const getIngredientName = (ingredient: Ingredient) =>
	{
		return nodes[ingredient.itemId]?.name ?? ingredient.itemId;
	};

	const getComboboxItems = (currentIndex: number) =>
	{
		return Object.values(nodes).filter((node) =>
		{
			const isItem = node.type === 'item';
			const isNotSelected = !ingredients.some((ing, index) => index !== currentIndex && ing.itemId === node.id);
			return isItem && isNotSelected;
		});
	};

	const addIngredient = () =>
	{
		if (!editMode) return;

		const newIngredient: Ingredient = {
			id: crypto.randomUUID(),
			itemId: '',
			quantity: 1,
			recipeId: recipe.id,
		};

		onIngredientsChange([
			...ingredients,
			{
				...newIngredient,
			},
		]);
	};

	const updateIngredient = (index: number, patch: Partial<Ingredient>) =>
	{
		if (!editMode) return;

		const next = [...ingredients];
		next[index] = { ...next[index], ...patch };
		onIngredientsChange(next);
	};

	const removeIngredient = (index: number) =>
	{
		if (!editMode) return;

		onIngredientsChange(ingredients.filter((_, i) => i !== index));
	};

	const ingredientComboBox = (ingredient: Ingredient, index: number) =>
	{
		const items: Node[] = getComboboxItems(index);
		const value = nodes[ingredient.itemId] ?? null;

		const onValueChange = (node: Node | null) =>
		{
			updateIngredient(index, { itemId: node?.id ?? '' });
		};

		return (
			<Combobox items={items} value={value} onValueChange={onValueChange} itemToStringLabel={(node) => node.name} itemToStringValue={(node) => node.id}>
				<ComboboxInput placeholder="Select an item" showClear />
				<ComboboxContent>
					<ComboboxEmpty>No items found.</ComboboxEmpty>
					<ComboboxList>
						{(node) => (
							<ComboboxItem key={node.id} value={node}>
								{node.name}
							</ComboboxItem>
						)}
					</ComboboxList>
				</ComboboxContent>
			</Combobox>
		);
	};

	const displayIngredients = () =>
	{
		if (editMode)
		{
			return ingredients.map((ingredient, index) => (
				<TableRow key={index}>
					<TableCell>{ingredientComboBox(ingredient, index)}</TableCell>
					<TableCell>
						<Input
							id={`ingredient-qty-${index}`}
							type="number"
							min={1}
							value={ingredient.quantity}
							onChange={(e) => updateIngredient(index, { quantity: Number(e.target.value) })}
							className="h-8 text-sm"
						/>
					</TableCell>
					<TableCell className="text-right">
						<Button variant="destructive" size="icon" onClick={() => removeIngredient(index)}>
							<XIcon />
						</Button>
					</TableCell>
				</TableRow>
			));
		}
		else
		{
			return ingredients.map((ingredient, index) => (
				<TableRow key={index}>
					<TableCell>{getIngredientName(ingredient)}</TableCell>
					<TableCell>{ingredient.quantity}</TableCell>
				</TableRow>
			));
		}
	};

	return (
		<div className="rounded-md border flex-1 flex flex-col overflow-hidden">
			<div className="overflow-y-auto flex-1 no-scrollbar">
				<Table>
					<TableHeader className="bg-muted/50">
						<TableRow>
							<TableHead>Item</TableHead>
							<TableHead>Quantity</TableHead>
							{editMode && <TableHead className="text-right">Actions</TableHead>}
						</TableRow>
					</TableHeader>
					<TableBody>{displayIngredients()}</TableBody>
				</Table>
			</div>
			{editMode && (
				<div className="border-t">
					<div className="text-center py-3 cursor-pointer hover:bg-muted/50" onClick={addIngredient}>
						Add Ingredient
					</div>
				</div>
			)}
		</div>
	);
}
