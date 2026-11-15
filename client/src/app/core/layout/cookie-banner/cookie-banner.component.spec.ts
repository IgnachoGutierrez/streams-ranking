import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsConsent, AnalyticsService } from '../../analytics/analytics.service';
import { CookieBannerComponent } from './cookie-banner.component';

describe('CookieBannerComponent', () => {
  let fixture: ComponentFixture<CookieBannerComponent>;
  let host: HTMLElement;
  const enabled = signal(true);
  const consent = signal<AnalyticsConsent | null>(null);
  const analytics = {
    enabled,
    consent,
    grantConsent: jasmine.createSpy('grantConsent').and.callFake(() => consent.set('granted')),
    denyConsent: jasmine.createSpy('denyConsent').and.callFake(() => consent.set('denied')),
  };

  const button = (label: string) =>
    Array.from(host.querySelectorAll('button')).find((b) => b.textContent?.trim() === label)!;

  beforeEach(async () => {
    enabled.set(true);
    consent.set(null);
    analytics.grantConsent.calls.reset();
    analytics.denyConsent.calls.reset();

    await TestBed.configureTestingModule({
      imports: [CookieBannerComponent],
      providers: [{ provide: AnalyticsService, useValue: analytics }],
    }).compileComponents();
    fixture = TestBed.createComponent(CookieBannerComponent);
    host = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('shows when analytics is on and the user has not chosen', () => {
    expect(host.querySelector('.banner')).toBeTruthy();
  });

  it('stays hidden when analytics is off', () => {
    enabled.set(false);
    fixture.detectChanges();
    expect(host.querySelector('.banner')).toBeNull();
  });

  it('stays hidden once the user has chosen', () => {
    consent.set('denied');
    fixture.detectChanges();
    expect(host.querySelector('.banner')).toBeNull();
  });

  it('grants consent and hides on "Aceptar"', () => {
    button('Aceptar').click();
    fixture.detectChanges();
    expect(analytics.grantConsent).toHaveBeenCalled();
    expect(host.querySelector('.banner')).toBeNull();
  });

  it('denies consent and hides on "Rechazar"', () => {
    button('Rechazar').click();
    fixture.detectChanges();
    expect(analytics.denyConsent).toHaveBeenCalled();
    expect(host.querySelector('.banner')).toBeNull();
  });
});
