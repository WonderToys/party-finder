import request from 'request-promise-native';
import config from 'config';

// Fields
const ROOT_URI = 'https://discordapp.com/api/v6';
const AUTHORIZATION = Buffer.from(`${ config.get('api.discord.clientId') }:${ config.get('api.discord.clientSecret') }`).toString('base64');
const SCOPES = [ 'identify', 'guilds.join', 'guilds', 'gdm.join', 'rpc', 'rpc.api' ].join(' ');
const REDIRECT_URI = `${ config.get('server.rootUri') }/discord/callback`;

// getToken()
export const getToken = async (token, isRefresh) => {
  const grantType = isRefresh === true ? 'refresh_token' : 'authorization_code';
  const codeType = isRefresh === true ? 'refresh_token' : 'code';
  const uri = `${ ROOT_URI }/oauth2/token?grant_type=${ grantType }&${ codeType }=${ token }&scope=${ SCOPES }&redirect_uri=${ REDIRECT_URI }`;

  const opts = {
    uri,
    method: 'POST',
    headers: {
      Authorization: `Basic ${ AUTHORIZATION }`
    }
  };

  return request(opts);
}; //- getToken()

// getMe()
export const getMe = async (token) => {
  const uri = `${ ROOT_URI }/users/@me`;
  const opts = {
    uri,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${ token }`
    }
  };


  return request(opts);
}; //- getMe()