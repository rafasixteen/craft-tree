import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

export function getApolloClient()
{
	return new ApolloClient({
		link: new HttpLink({
			uri: '/api/graphql',
			credentials: 'same-origin',
		}),
		cache: new InMemoryCache(),
	});
}
