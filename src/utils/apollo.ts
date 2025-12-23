import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import { ErrorLink } from '@apollo/client/link/error';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { errorHandler } from '@fluxu-labs/lib';
import { OperationTypeNode } from 'graphql';
import { createClient } from 'graphql-ws';
import { ENV } from 'src/env';
import { eventEmitter } from './eventEmitter';

// ----------------------------------------------------------------------

type HeadersFn = () => Promise<{ [key: string]: string }>;

// ----------------------------------------------------------------------

const errorLink = () => {
  return new ErrorLink((error) => {
    eventEmitter.emit('apolloError', { error });
    errorHandler({ error });
  });
};

const wsLink = ({ url, headers }: { url: string; headers: HeadersFn }) => {
  return new GraphQLWsLink(
    createClient({
      url: url,
      keepAlive: 5000,
      shouldRetry: () => true,
      retryAttempts: Infinity,
      connectionParams: async () => ({ headers: await headers() }),
    }),
  );
};

const httpLink = ({ url, headers }: { url: string; headers: HeadersFn }) => {
  return new HttpLink({
    uri: url,
    fetch: async (uri, options) => {
      if (options) {
        options.headers = {
          ...options.headers,
          ...(await headers()),
        };
      }
      return fetch(uri, options);
    },
  });
};

// ----------------------------------------------------------------------

const getApolloClient = ({
  wsUrl,
  httpUrl,
  headers,
}: {
  wsUrl: string;
  httpUrl: string;
  headers: HeadersFn;
}) => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    queryDeduplication: false,
    defaultOptions: {
      watchQuery: { fetchPolicy: 'no-cache', errorPolicy: 'none' },
      query: { fetchPolicy: 'no-cache', errorPolicy: 'none' },
      mutate: { errorPolicy: 'none' },
    },
    link: errorLink().concat(
      ApolloLink.split(
        ({ operationType }) => operationType === OperationTypeNode.SUBSCRIPTION,
        wsLink({ url: wsUrl, headers }),
        httpLink({ url: httpUrl, headers }),
      ),
    ),
  });
};

// ----------------------------------------------------------------------

const apolloClient = getApolloClient({
  wsUrl: ENV.HASURA_WSS,
  httpUrl: ENV.HASURA_HTTPS,
  headers: async () => ({
    'x-hasura-admin-secret': ENV.HASURA_ADMIN_SECRET,
    'x-hasura-role': 'admin',
  }),
});

// ----------------------------------------------------------------------

export { apolloClient };
