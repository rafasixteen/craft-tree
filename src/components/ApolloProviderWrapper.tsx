'use client';

import { ReactNode } from 'react';
import { ApolloProvider } from '@apollo/client/react';
import { getApolloClient } from '@/lib/apollo-client';

const client = getApolloClient();

export function ApolloProviderWrapper({ children }: { children: ReactNode })
{
	return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
