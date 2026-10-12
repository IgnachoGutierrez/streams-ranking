import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ToolbarComponent } from './toolbar.component';

describe('ToolbarComponent', () => {
  let fixture: ComponentFixture<ToolbarComponent>;
  let host: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolbarComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(ToolbarComponent);
    host = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('renders the section links in Spanish, in order', () => {
    const links = Array.from(host.querySelectorAll('nav a')).map((a) => a.textContent?.trim());
    expect(links).toEqual(['Características', 'Cómo funciona']);
  });

  it('points the section links to their fragments', () => {
    const hrefs = Array.from(host.querySelectorAll('nav a')).map((a) => a.getAttribute('href'));
    expect(hrefs).toEqual(['/#features', '/#how-it-works']);
  });

  it('links the brand to the home page', () => {
    expect(host.querySelector('.toolbar__brand')?.getAttribute('href')).toBe('/');
  });

  it('includes the ranking CTA pointing to the login endpoint', () => {
    const cta = host.querySelector('app-ranking-cta a');
    expect(cta?.getAttribute('href')).toBe(`${environment.apiUrl}/auth/login`);
  });
});
