'use client';

import { ItemGridProvider } from '@/components/item';

interface ItemsLayoutProps
{
	children: React.ReactNode;
}

export default function ItemsLayout({ children }: ItemsLayoutProps)
{
	return <ItemGridProvider>{children}</ItemGridProvider>;
}
