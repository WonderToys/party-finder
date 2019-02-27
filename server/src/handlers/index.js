import request from 'request-promise-native';
import config from 'config';

import Schema from '../graphql/Schema.graphql';
import Party from '../models/Party';

// Resolvers
export const resolvers = {
  Query: {
    async searchParties(_, { gameName }) {
      return Party.find({ 
        $text: { $search: gameName }
      });
    },
    async searchGames(_, { query }, context) {
      const opts = {
        uri: `https://api.twitch.tv/kraken/search/games?query=${ query }`,
        method: 'GET',
        headers: {
          'Client-ID': config.get('api.twitch.clientId'),
          Accept: 'application/vnd.twitchtv.v5+json' 
        }
      };

      const result = await request(opts);
      return JSON.parse(result).games;
    }
  }
};

// Schema
export const schema = Schema;