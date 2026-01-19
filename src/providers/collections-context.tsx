'use client';

import { Collection } from '@/domain/collection';
import React, { createContext, useContext } from 'react';

interface CollectionsContextType
{
	collections: Collection[];
	activeCollection: Collection;
}

const CollectionsContext = createContext<CollectionsContextType | undefined>(undefined);

interface CollectionsProviderProps
{
	children: React.ReactNode;
	collections: Collection[];
	activeCollection: Collection;
}

export function CollectionsProvider({ children, collections, activeCollection }: CollectionsProviderProps)
{
	return <CollectionsContext.Provider value={{ collections, activeCollection }}>{children}</CollectionsContext.Provider>;
}

export function useCollectionsContext()
{
	const context = useContext(CollectionsContext);
	if (!context) throw new Error('useCollectionsContext must be used within a CollectionsProvider');
	return context;
}
