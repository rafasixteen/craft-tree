'use client';

import { Collection } from '@/domain/collection';
import React, { createContext, useContext } from 'react';

interface CollectionContextType
{
	collections: Collection[];
	activeCollection: Collection;
}

const CollectionContext = createContext<CollectionContextType | undefined>(undefined);

interface CollectionProviderProps
{
	children: React.ReactNode;
	collections: Collection[];
	activeCollection: Collection;
}

export function CollectionProvider({ children, collections, activeCollection }: CollectionProviderProps)
{
	return <CollectionContext.Provider value={{ collections, activeCollection }}>{children}</CollectionContext.Provider>;
}

export function useCollectionContext()
{
	const context = useContext(CollectionContext);
	if (!context) throw new Error('useCollectionContext must be used within a CollectionProvider');
	return context;
}
