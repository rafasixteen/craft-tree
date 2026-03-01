'use server';

import { cookies } from 'next/headers';
import { Header } from '@/components/craft-tree-sidebar';
import { ProductionGraph } from '@/components/production-graph/flow';
import { ReactFlowProvider } from '@xyflow/react';

export default async function ProductionGraphPage()
{
	const cookieStore = await cookies();
	const themeCookie = cookieStore.get('theme')?.value;

	const initialTheme = themeCookie === 'dark' || themeCookie === 'light' ? themeCookie : 'light';

	return (
		<>
			<Header />
			<ReactFlowProvider>
				<ProductionGraph initialTheme={initialTheme} />
			</ReactFlowProvider>
		</>
	);
}
