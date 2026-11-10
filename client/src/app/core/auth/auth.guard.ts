import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';

interface AuthMe { authenticated: boolean; }

// Sends the user through the Spotify login flow when /auth/me reports they are
// not authenticated (e.g. the access token cookie expired).
export const authGuard: CanActivateFn = () =>
  inject(HttpClient)
    .get<AuthMe>(`${environment.apiUrl}/auth/me`)
    .pipe(
      map(({ authenticated }) => {
        if (authenticated) return true;
        // Server endpoint that redirects to Spotify, so leave the SPA entirely.
        window.location.href = `${environment.apiUrl}/auth/login`;
        return false;
      }),
    );
