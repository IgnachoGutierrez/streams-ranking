import config from './config.js';

export const tokenCookieOptions = {
  httpOnly: true,            // not readable from JS
  // HTTPS-only when the app is served over HTTPS. Based on the public origin,
  // not NODE_ENV: the local Docker stack runs NODE_ENV=production over HTTP.
  secure: config.frontendUrl.startsWith('https://'),
  sameSite: 'lax' as const,  // sent on the top-level redirect back from Spotify
  path: '/',
};

export const STATE_KEY = 'spotify_auth_state';
export const ACCESS_TOKEN_COOKIE = 'spotify_access_token';
export const REFRESH_TOKEN_COOKIE = 'spotify_refresh_token';