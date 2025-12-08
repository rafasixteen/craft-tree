'use client';

import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import { Item } from '@/graphql/generated/graphql';
import { useEffect, useState } from 'react';
import { getItemById } from '@/lib/graphql/items';
import styles from './recipe-node.module.css';

export type RecipeNodeData = {
	item: Item;
	isRoot: boolean;
	currentRecipeIndex: number;
};

export type RecipeNodeType = Node<RecipeNodeData>;

export default function RecipeNode({ data }: NodeProps<RecipeNodeType>)
{
	const [recipeIndex, setRecipeIndex] = useState(data.currentRecipeIndex);

	useEffect(() =>
	{
		data.currentRecipeIndex = recipeIndex;
	}, [data, recipeIndex]);

	function prevRecipe()
	{
		const prevIndex = (recipeIndex - 1 + recipes.length) % recipes.length;
		setRecipeIndex(prevIndex);
	}

	function nextRecipe()
	{
		const nextIndex = (recipeIndex + 1) % recipes.length;
		setRecipeIndex(nextIndex);
	}

	if (!data.item) return <div className={styles.node}>Loading...</div>;

	const recipes = data.item.recipes;
	const recipe = recipes[recipeIndex];

	return (
		<div className={styles.node}>
			<p> {data.item.name}</p>

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
						{recipeIndex + 1}/{recipes.length}
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
