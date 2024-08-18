import { REFRESH_TOKEN } from '@/graphql/mutations';
import { GRAPHQL_URI } from '@/utils/constants';
import { ApolloClient, ApolloLink, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { fromPromise } from '@apollo/client/link/utils'; // Import fromPromise utility

const httpLink = createHttpLink({
  uri: GRAPHQL_URI,
  credentials: 'include',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const refreshToken = async () => {
  try {
    const { data } = await client.mutate({
      mutation: REFRESH_TOKEN,
    });

    if (data?.refreshToken.token?.value) {
      localStorage.setItem('token', data.refreshToken.token.value);
      return data.refreshToken.token.value;
    }
  } catch (error) {
    console.error('Failed to refresh token:', error);
    localStorage.removeItem('token');
    window.location.reload();
  }

  return null;
};

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (err.extensions?.code === 'AUTH_NOT_AUTHORIZED') {
        return fromPromise(
          refreshToken().catch((error) => {
            console.error('Failed to refresh token:', error);
            return null;
          })
        )
          .filter((value) => Boolean(value))
          .flatMap((newToken): any => {
            if (newToken) {
              operation.setContext(({ headers = {} }) => ({
                headers: {
                  ...headers,
                  authorization: `Bearer ${newToken}`,
                },
              }));

              // Retry the request with the new token
              return forward(operation);
            } else {
              console.error('Token refresh failed, cannot retry the request.');
              return;
            }
          });
      }
    }
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

const link = ApolloLink.from([authLink, errorLink, httpLink]);

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  credentials: 'include',
});
