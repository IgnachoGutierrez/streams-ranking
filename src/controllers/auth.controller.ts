import express, { Request, Response } from 'express';
import { Query } from 'express-serve-static-core';

import { generateRandomString, generateToken } from "../services/auth.service";
import config from '../config/config';
import logger from '../logger';

const stateKey = 'spotify_auth_state';

export interface TypedRequestQuery<T extends Query> extends express.Request {
    query: T;
}

export async function login(req: Request, res: Response) {
    const { redirectUri, clientId } = config;
    const state = generateRandomString(16);
    res.cookie(stateKey, state);

    const scope = 'user-read-private user-read-email';

    const params: URLSearchParams = new URLSearchParams({
        response_type: 'code',
        client_id: clientId,
        scope: scope,
        redirect_uri: redirectUri,
        state: state
    });

    res.redirect('https://accounts.spotify.com/authorize?' + params.toString());
}

export async function handleAuthorizationCode(req: TypedRequestQuery<{
    code: string;
    state: string;
  }>, res: Response) {
  
    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[stateKey] : null;
  
    if (state === null || state !== storedState) {
  
      const params = new URLSearchParams({
        error: "state_mismatch",
      });
  
      res.redirect('/#' + params.toString());
    }
  
    if (code === null) {
      return res.status(400).send();
    }
  
    res.clearCookie(stateKey);
  
    const { access_token, refresh_token } = await generateToken(code);
    logger.info('access token: ' + access_token);
    logger.info('refresh token: ' + refresh_token);
  
    const params = new URLSearchParams({
      access_token,
      refresh_token,
    });
  
    res.redirect('/#' + params);
}