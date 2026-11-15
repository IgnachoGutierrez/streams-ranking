import { DestroyRef, DOCUMENT, Injectable, inject, signal } from '@angular/core';
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

export type AnalyticsConsent = 'granted' | 'denied';

const MEASUREMENT_ID_PATTERN = /^G-[A-Z0-9]+$/;
export const CONSENT_STORAGE_KEY = 'analytics-consent';

/**
 * Google Analytics 4 (gtag.js). Does nothing unless the build received a
 * measurement ID (see GA_MEASUREMENT_ID in .env.template and client/Dockerfile).
 *
 * Starts with consent denied; the cookie banner calls grantConsent() or
 * denyConsent(), and the choice is remembered in localStorage.
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private readonly _enabled = signal(false);
  private readonly _consent = signal<AnalyticsConsent | null>(null);

  /** True once gtag.js is set up, i.e. the build has a measurement ID. */
  readonly enabled = this._enabled.asReadonly();
  /** The user's choice, or null while they have not chosen yet. */
  readonly consent = this._consent.asReadonly();

  init(id: string = environment.gaMeasurementId): void {
    const win = this.document.defaultView;
    if (this._enabled() || !win || !MEASUREMENT_ID_PATTERN.test(id)) return;
    this._enabled.set(true);

    win.dataLayer = win.dataLayer || [];
    // gtag.js expects the `arguments` object itself, so this cannot be an arrow function.
    win.gtag = function () {
      // eslint-disable-next-line prefer-rest-params
      win.dataLayer.push(arguments);
    };

    // Nothing is stored until the user consents (GDPR).
    win.gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
    // Re-apply an earlier choice before the first page view is sent.
    const stored = this.readStoredConsent();
    this._consent.set(stored);
    if (stored === 'granted') win.gtag('consent', 'update', { analytics_storage: 'granted' });

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
    if (this._enabled()) window.gtag('event', name, params);
  }

  grantConsent(): void {
    this.setConsent('granted');
  }

  denyConsent(): void {
    this.setConsent('denied');
    this.deleteGaCookies();
  }

  /** Forgets the choice so the banner shows again (e.g. from a "Cookies" link). */
  resetConsent(): void {
    if (!this._enabled()) return;
    this._consent.set(null);
    try {
      localStorage.removeItem(CONSENT_STORAGE_KEY);
    } catch {
      // Storage unavailable (private mode, blocked): nothing to forget.
    }
  }

  private setConsent(value: AnalyticsConsent): void {
    if (!this._enabled()) return;
    this._consent.set(value);
    window.gtag('consent', 'update', { analytics_storage: value });
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, value);
    } catch {
      // Storage unavailable: the choice applies to this visit only.
    }
  }

  private readStoredConsent(): AnalyticsConsent | null {
    try {
      const value = localStorage.getItem(CONSENT_STORAGE_KEY);
      return value === 'granted' || value === 'denied' ? value : null;
    } catch {
      return null;
    }
  }

  /** Removes _ga / _ga_<id> cookies left from an earlier "accept". */
  private deleteGaCookies(): void {
    const names = this.document.cookie
      .split(';')
      .map((c) => c.split('=')[0].trim())
      .filter((name) => name === '_ga' || name.startsWith('_ga_'));
    if (!names.length) return;

    // gtag.js sets them on the widest domain it can, so try every parent domain.
    const parts = this.document.location.hostname.split('.');
    const domains = [''];
    for (let i = 0; i < parts.length - 1; i++) domains.push(`; domain=.${parts.slice(i).join('.')}`);

    for (const name of names) {
      for (const domain of domains) {
        this.document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`;
      }
    }
  }
}
