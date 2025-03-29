import crypto from 'crypto';
import config from '../config/config';

export const generateRandomString = (length: number) => {
    return crypto.randomBytes(60).toString("hex").slice(0, length);
}
  
export async function generateToken(code: string): Promise<{ refresh_token: string; access_token: string }> {
    const { redirectUri, clientId, clientSecret } = config;

    const bodyParams = new URLSearchParams({
        code: code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
    })

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (Buffer.from(clientId + ':' + clientSecret).toString('base64'))
        },
        body: bodyParams,
    });

    const data = await response.json();

    return data as { refresh_token: string; access_token: string };
}