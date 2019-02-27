import { remote } from 'electron';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';

// Create our HttpLink
const httpLink = new HttpLink({
  uri: `${ remote.app.config.serverRootUri }/graphql`
});

// Create our linkContext
const linkContext = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `JWT ${ token }` : null
    }
  }
});

// Create our cache
const cache = new InMemoryCache();

// Exports
export default new ApolloClient({
  link: linkContext.concat(httpLink),
  cache
});