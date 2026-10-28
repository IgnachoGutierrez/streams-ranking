import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/landing/landing.page').then((m) => m.LandingPage),
  },
  {
    path: 'most-listened',
    loadComponent: () =>
      import('./features/most-listened/most-listened.page').then((m) => m.MostListenedPage),
  },
];
