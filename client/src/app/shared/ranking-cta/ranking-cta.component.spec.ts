import { ComponentFixture, TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { RankingCtaComponent } from './ranking-cta.component';

describe('RankingCtaComponent', () => {
  let fixture: ComponentFixture<RankingCtaComponent>;
  let host: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [RankingCtaComponent] }).compileComponents();
    fixture = TestBed.createComponent(RankingCtaComponent);
    host = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('links to the login endpoint', () => {
    const link = host.querySelector('a') as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe(`${environment.apiUrl}/auth/login`);
  });

  it('uses the light variant by default', () => {
    expect(host.classList).toContain('cta--light');
  });

  it('switches to the gradient variant', () => {
    fixture.componentRef.setInput('variant', 'gradient');
    fixture.detectChanges();
    expect(host.classList).toContain('cta--gradient');
    expect(host.classList).not.toContain('cta--light');
  });

  it('shows the label', () => {
    expect(host.querySelector('a')?.textContent).toContain('Ver mi ranking');
  });
});
