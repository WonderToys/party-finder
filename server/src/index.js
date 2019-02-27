import { ApolloServer, AuthenticationError } from 'apollo-server-fastify';
import fastify from 'fastify';
import mongoose from 'mongoose';
import config from 'config';
import jsonwebtoken from 'jsonwebtoken';

import User from './models/User';
import { schema, resolvers } from './handlers';
import * as discord from './api/discord';

// Connect to mongodb
mongoose.connect(config.get('server.mongoUri'), { useNewUrlParser: true });

// Helpers
const getTokenFromString = (string) => {
  const parts = string.split(' ');
  const scheme = parts[0];

  if ( /^Bearer$/i.test(scheme) || /^JWT$/i.test(scheme) ) {
    return parts[1];
  }

  return null;
};

const verifyToken = (token) => {
  if ( token == null ) return false;

  try {
    const decoded = jsonwebtoken.verify(token, config.get('server.jwtSecret'));
    return decoded;
  }
  catch ( error ) {
    return false;
  }
}

// Create our servers
const app = fastify();
const apolloServer = new ApolloServer({ 
  // This should maybe live somewhere else?
  async context({ req }) {
    let user = null;
    if ( req.headers && req.headers.authorization ) {
      const token = getTokenFromString(req.headers.authorization);
      const decoded = verifyToken(token);

      if ( decoded && decoded.userId ) {
        user = await User.findById(decoded.userId);
      }
    }

    return { user };
  },
  typeDefs: schema, 
  resolvers 
});

// Register routes
// TODO: These routes should be in a controller. 
app.get('/auth/verify', async (req, reply) => {
  // This function could use some love
  if ( req.headers && req.headers.authorization ) {
    const token = getTokenFromString(req.headers.authorization);
    const decoded = verifyToken(token);

    if ( decoded && decoded.userId ) {
      const user = await User.findById(decoded.userId);
      if ( user != null ) {
        const discordProfile = user.providers.find(p => p.source === 'discord');
        if ( discordProfile != null ) {
          let discordUser = await discord.getMe(discordProfile.accessToken);
          discordUser = JSON.parse(discordUser);

          user.name = discordUser.username;
          user.discriminator = discordUser.discriminator;
          discordProfile.profile = discordUser;

          user.save();
          reply.status(200).send({ user });

          return;
        }
      }
    }
  }

  reply.status(401).send({ error: 'Invalid token' });
});

app.get('/discord/auth', (req, reply) => {
  const redirectUri = `${ config.get('server.rootUri') }/discord/callback`;
  const uri = `https://discordapp.com/oauth2/authorize?client_id=548645358788542494&redirect_uri=${ redirectUri }&response_type=code&scope=identify%20email%20guilds%20guilds.join%20gdm.join%20rpc%20rpc.api`;

  reply.redirect(uri);
});

app.get('/discord/callback', async (req, reply) => {
  if ( !req.query || !req.query.code ) {
    reply.redirect('http://party-finder/auth?error=failed');
    return;
  }

  const resp = await discord.getToken(req.query.code);
  const parsed = JSON.parse(resp);

  let discordUser = await discord.getMe(parsed.access_token);
  discordUser = JSON.parse(discordUser);

  let user = await User.findOne({ 
    name: discordUser.username,
    discriminator: discordUser.discriminator
  });

  if ( user == null ) {
    user = await User.create();
  }

  user.name = discordUser.username;
  user.discriminator = discordUser.discriminator;
  user.providers = user.providers.filter(p => p.source !== 'discord');
  user.providers.push({
    source: 'discord',
    accessToken: parsed.access_token,
    refreshToken: parsed.refresh_token,
    profile: discordUser
  });

  await user.save();
  
  const token = jsonwebtoken.sign({ userId: user._id }, config.get('server.jwtSecret'));
  reply.redirect(`http://party-finder/auth?user=${ JSON.stringify(user) }&token=${ token }`);
  //reply.send({ user, token });
});

// Start server
(async function() {
  app.register(apolloServer.createHandler());
  await app.listen(3000);

  console.log('Server is running ...');
})();