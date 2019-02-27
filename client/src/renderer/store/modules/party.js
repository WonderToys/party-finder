import apolloClient from '../../apollo';

import SearchGames from '../../../graphql/queries/searchGames.graphql';

// -----
//  Actions
// -----

const actions = {
  // searchGames()
  async searchGames(context, query) {
    try {
      const response = await apolloClient.query({
        query: SearchGames,
        variables: { query }
      });

      const result = response && response.data ? response.data.searchGames : [];
      return result.map(g => { 
        let name = g.name;
        if ( name.length > 30 ) {
          name = `${ name.substr(0, 30) } ...`;
        }

        return { name, key: g._id }
      });
    }
    catch ( error ) {
      return [];
    }
  } //- searchGames()
};

// Exports
export default {
  namespaced: true,
  actions
};