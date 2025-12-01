'use client';

import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import { Item, Recipe } from '@/graphql/generated/graphql';
import { useEffect, useState } from 'react';
import { getItemById } from '@/lib/items';
import styles from './recipe-node.module.css';

type RecipeNodeData = {
	itemId: string;
	isRoot: boolean;
	onRecipeChanged: (recipeIndex: number) => void;
};

type RecipeNode = Node<RecipeNodeData>;

export default function RecipeNode({ data }: NodeProps<RecipeNode>)
{
	const [item, setItem] = useState<Item | null>(null);
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() =>
	{
		getItemById(data.itemId).then((fetched) => setItem(fetched));
	}, [data.itemId]);

	if (!item) return <div className={styles.node}>Loading...</div>;

	const recipes = item.recipes ?? [];
	const recipe = recipes[currentIndex];

	const nextRecipe = () =>
	{
		let nextIndex = (currentIndex + 1) % recipes.length;
		setCurrentIndex(nextIndex);
		data.onRecipeChanged(nextIndex);
	};

	const prevRecipe = () =>
	{
		let prevIndex = (currentIndex - 1 + recipes.length) % recipes.length;
		setCurrentIndex(prevIndex);
		data.onRecipeChanged(prevIndex);
	};

	return (
		<div className={styles.node}>
			<p> {item.name}</p>

			{recipe && (
				<div className={styles.recipe}>
					<p>Quantity: {recipe.quantity}</p>
					<p>Time: {recipe.time}</p>
					<div>
						Ingredients:
						<ul>
							{recipe.ingredients?.map((ing) => (
								<li key={ing.id}>
									{ing.item.name} x {ing.quantity}
								</li>
							))}
						</ul>
					</div>
				</div>
			)}

			{recipes.length > 1 && (
				<div className={styles.carouselControls}>
					<button onClick={prevRecipe}>&lt;</button>
					<span>
						{currentIndex + 1}/{recipes.length}
					</span>
					<button onClick={nextRecipe}>&gt;</button>
				</div>
			)}

			{/* Only render target handle if not a root node. */}
			{!data.isRoot && <Handle type="target" position={Position.Top} />}

			{/* Always render source (output) handle. */}
			<Handle type="source" position={Position.Bottom} />
		</div>
	);
}
