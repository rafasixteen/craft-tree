'use client';

import { useParams } from 'next/navigation';

export default function ItemPage()
{
	const params = useParams();
	const itemId = params['item-id'];

	return <p>Item ID: {itemId}</p>;
}
