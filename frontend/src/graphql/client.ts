import { GRAPHQL_URI } from '@/utils/constants';
import { ApolloClient, ApolloLink, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
// import { onError } from '@apollo/client/link/error';

const httpLink = createHttpLink({
  uri: GRAPHQL_URI,
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

// const errorLink = onError(({}) => {});

export const client = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache(),
  credentials: 'include',
});

// const refreshToken = async () => {
//   const { data } = await client.mutate({
//     mutation: REFRESH_TOKEN,
//   });

//   if (data?.refreshToken.token?.value) {
//     localStorage.setItem('token', data.refreshToken.token.value);
//     return data.refreshToken.token.value;
//   }
// };
