'use client';

import { ItemSelectionProvider } from '@/components/inventory';

interface ItemsLayoutProps
{
	children: React.ReactNode;
}

export default function ItemsLayout({ children }: ItemsLayoutProps)
{
	return <ItemSelectionProvider>{children}</ItemSelectionProvider>;
}
