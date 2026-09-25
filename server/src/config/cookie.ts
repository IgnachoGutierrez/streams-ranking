export const tokenCookieOptions = {
  httpOnly: true,            // not readable from JS
  secure: process.env.NODE_ENV === 'production',     // HTTPS-only outside dev
  sameSite: 'lax' as const,  // sent on the top-level redirect back from Spotify
  path: '/',
};

export const STATE_KEY = 'spotify_auth_state';
export const ACCESS_TOKEN_COOKIE = 'spotify_access_token';
export const REFRESH_TOKEN_COOKIE = 'spotify_refresh_token';