import { DestroyRef, DOCUMENT, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

import { environment } from '../../../environments/environment';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

const MEASUREMENT_ID_PATTERN = /^G-[A-Z0-9]+$/;

/**
 * Google Analytics 4 (gtag.js). Does nothing unless the build received a
 * measurement ID (see GA_MEASUREMENT_ID in .env.template and client/Dockerfile).
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private initialized = false;

  init(): void {
    const id = environment.gaMeasurementId;
    const win = this.document.defaultView;
    if (this.initialized || !win || !MEASUREMENT_ID_PATTERN.test(id)) return;
    this.initialized = true;

    win.dataLayer = win.dataLayer || [];
    // gtag.js expects the `arguments` object itself, so this cannot be an arrow function.
    win.gtag = function () {
      // eslint-disable-next-line prefer-rest-params
      win.dataLayer.push(arguments);
    };

    // Nothing is stored until the user consents (GDPR); see grantConsent().
    win.gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
    win.gtag('js', new Date());
    // Page views are sent on route changes below. Turn off "Page changes based
    // on browser history events" in GA4 enhanced measurement to avoid doubles.
    win.gtag('config', id, { send_page_view: false });

    const script = this.document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    this.document.head.appendChild(script);

    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => win.gtag('event', 'page_view', { page_location: win.location.href }));
  }

  event(name: string, params?: Record<string, unknown>): void {
    if (this.initialized) window.gtag('event', name, params);
  }

  grantConsent(): void {
    if (this.initialized) window.gtag('consent', 'update', { analytics_storage: 'granted' });
  }
}
