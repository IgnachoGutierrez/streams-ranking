import { Routes } from '@angular/router';

import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    title: 'Inicio',
    loadComponent: () =>
      import('./features/landing/landing.page').then((m) => m.LandingPage),
  },
  {
    path: 'most-listened',
    title: 'Lo que más escuchaste',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/most-listened/most-listened.page').then((m) => m.MostListenedPage),
  },
];
