import { ComponentFixture, TestBed } from '@angular/core/testing';
import { environment } from '../../../../../environments/environment';
import { HowItWorksComponent } from './how-it-works.component';

describe('HowItWorksComponent', () => {
  let fixture: ComponentFixture<HowItWorksComponent>;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HowItWorksComponent] }).compileComponents();
    fixture = TestBed.createComponent(HowItWorksComponent);
    el = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('renders the section title', () => {
    expect(el.querySelector('h2')?.textContent).toBe('Tu ranking en tres pasos');
  });

  it('highlights "tres pasos" in the title', () => {
    expect(el.querySelector('h2 .how__accent')?.textContent).toBe('tres pasos');
  });

  it('renders the introductory text', () => {
    expect(el.querySelector('.how__heading p')?.textContent).toBe(
      'No hace falta registrarte: alcanza con tu cuenta de Spotify.',
    );
  });

  it('renders the 3 steps in order as an ordered list', () => {
    const titles = Array.from(el.querySelectorAll('ol.how__steps > li h3')).map((h) => h.textContent);
    expect(titles).toEqual(['Presioná Ver mi ranking', 'Ingresá con tu cuenta', 'Mirá tu ranking']);
  });

  it('links "Ver mi ranking" in the first step to the login', () => {
    const links = el.querySelectorAll('.step a');
    expect(links.length).toBe(1);
    expect(links[0].textContent).toBe('Ver mi ranking');
    expect(links[0].getAttribute('href')).toBe(`${environment.apiUrl}/auth/login`);
    expect(el.querySelector('.step:first-child h3 a')).toBe(links[0]);
  });

  it('shows every step text at once', () => {
    const texts = Array.from(el.querySelectorAll('.step p')).map((p) => p.textContent);
    expect(texts).toEqual([
      'Te llevamos a la página oficial de Spotify.',
      'Spotify te pide permiso para ver tu actividad. Nunca vemos tu contraseña.',
      'Tus artistas y canciones más escuchados del último mes, seis meses o de siempre.',
    ]);
  });

  it('numbers the steps', () => {
    const numbers = Array.from(el.querySelectorAll('.step__number')).map((n) => n.textContent?.trim());
    expect(numbers).toEqual(['1', '2', '3']);
  });

  it('has no image or CTA', () => {
    expect(el.querySelector('img')).toBeNull();
    expect(el.querySelector('app-ranking-cta')).toBeNull();
  });

  it('is the #how-it-works anchor target', () => {
    expect(el.querySelector('section')?.id).toBe('how-it-works');
  });
});
