import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AnalyticsService, CONSENT_STORAGE_KEY } from './analytics.service';

describe('AnalyticsService', () => {
  const TEST_ID = 'G-TEST123';

  function create(): AnalyticsService {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    return TestBed.inject(AnalyticsService);
  }

  /** gtag calls pushed so far, as plain arrays. */
  const calls = () => window.dataLayer.map((args) => Array.from(args as ArrayLike<unknown>));

  beforeEach(() => {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
    window.dataLayer = [];
  });

  afterEach(() => {
    document.querySelectorAll('script[src*="googletagmanager"]').forEach((s) => s.remove());
    localStorage.removeItem(CONSENT_STORAGE_KEY);
  });

  it('stays off without a valid measurement ID', () => {
    const service = create();
    service.init('');
    expect(service.enabled()).toBeFalse();
    expect(calls().length).toBe(0);
  });

  it('starts with consent denied and no choice', () => {
    const service = create();
    service.init(TEST_ID);
    expect(service.enabled()).toBeTrue();
    expect(service.consent()).toBeNull();
    expect(calls()[0]).toEqual(['consent', 'default', jasmine.objectContaining({ analytics_storage: 'denied' })]);
  });

  it('grants consent and remembers it', () => {
    const service = create();
    service.init(TEST_ID);
    service.grantConsent();
    expect(service.consent()).toBe('granted');
    expect(localStorage.getItem(CONSENT_STORAGE_KEY)).toBe('granted');
    expect(calls()).toContain(['consent', 'update', { analytics_storage: 'granted' }]);
  });

  it('re-applies a stored grant before configuring the tag', () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, 'granted');
    const service = create();
    service.init(TEST_ID);
    expect(service.consent()).toBe('granted');
    const names = calls().map((c) => c.slice(0, 2).join(' '));
    expect(names.indexOf('consent update')).toBeLessThan(names.indexOf(`config ${TEST_ID}`));
  });

  it('denies consent and remembers it', () => {
    const service = create();
    service.init(TEST_ID);
    service.denyConsent();
    expect(service.consent()).toBe('denied');
    expect(localStorage.getItem(CONSENT_STORAGE_KEY)).toBe('denied');
  });

  it('forgets the choice on reset', () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, 'denied');
    const service = create();
    service.init(TEST_ID);
    service.resetConsent();
    expect(service.consent()).toBeNull();
    expect(localStorage.getItem(CONSENT_STORAGE_KEY)).toBeNull();
  });
});
