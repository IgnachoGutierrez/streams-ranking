import express, { type Request, type Response } from 'express';
import type { Query } from 'express-serve-static-core';

import { generateRandomString, generateToken } from "../services/auth.service.js";
import config from '../config/config.js';
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE, STATE_KEY, tokenCookieOptions } from '../config/cookie.js';
import logger from '../logger.js';

export interface TypedRequestQuery<T extends Query> extends express.Request {
    query: T;
}

export async function login(req: Request, res: Response) {
    const { redirectUri, clientId } = config;
    const state = generateRandomString(16);

    res.cookie(STATE_KEY, state, {
      ...tokenCookieOptions,
      maxAge: 10 * 60 * 1000, // 10 min to complete the round-trip
    });

    const scope = 'user-read-private user-read-email';

    const params: URLSearchParams = new URLSearchParams({
        response_type: 'code',
        client_id: clientId,
        scope: scope,
        redirect_uri: redirectUri,
        state: state
    });

    logger.debug({ params: params.toString() }, 'redirecting to spotify auth with params: ');

    res.redirect('https://accounts.spotify.com/authorize?' + params.toString());
}

export async function handleAuthorizationCode(req: TypedRequestQuery<{
    code: string;
    state: string;
  }>, res: Response) {
    try {
      const code = req.query.code || null;
      const state = req.query.state || null;
      const storedState = req.cookies[STATE_KEY] || null;
    
      if (!state || !storedState || state !== storedState) {
    
        logger.warn({ state, storedState }, 'Spotify callback state mismatch');
    
        return res.status(403).json({ error: 'state_mismatch' });
      }
    
      if (code === null) {
        return res.status(400).json({ error: 'missing_authorization_code' });
      }

      res.clearCookie(STATE_KEY);
      logger.trace('cleared state cookie');

      const { access_token, refresh_token, expires_in } = await generateToken(code);

      res.cookie(ACCESS_TOKEN_COOKIE, access_token, {
        ...tokenCookieOptions,
        maxAge: expires_in * 1000,
      });

      if (refresh_token) {
        res.cookie(REFRESH_TOKEN_COOKIE, refresh_token, {
          ...tokenCookieOptions,
          maxAge: 30 * 24 * 60 * 60 * 1000, // long-lived
        });
      }

      logger.info('Stored Spotify tokens as httpOnly cookies');
    
      res.redirect(config.frontendUrl);
    } catch (error) {
      logger.error(error);
      return res.status(502).json({ error: 'token_generation_failed' });
    }
}