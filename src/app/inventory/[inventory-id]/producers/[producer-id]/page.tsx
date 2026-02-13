'use client';

import { useParams } from 'next/navigation';

export default function ProducerPage()
{
	const params = useParams();
	const producerId = params['producer-id'];

	return <p>Producer ID: {producerId}</p>;
}
