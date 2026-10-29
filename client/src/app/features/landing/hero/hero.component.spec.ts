import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RankingCtaComponent } from '../../../../shared/ranking-cta/ranking-cta.component';
import { HeroComponent } from './hero.component';

describe('HeroComponent', () => {
  let fixture: ComponentFixture<HeroComponent>;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HeroComponent] }).compileComponents();
    fixture = TestBed.createComponent(HeroComponent);
    el = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('renders the paragraph', () => {
    expect(el.querySelector('p')?.textContent).toContain('Obtené un ranking con tus artistas');
  });

  it('renders the page h1', () => {
    expect(el.querySelector('h1')?.textContent).toBe('Tus artistas y canciones más escuchadas');
  });

  it('shows the screenshot with its alt text', () => {
    expect(el.querySelector('img')?.getAttribute('alt')).toBe('Tus artistas más escuchados en Spotify');
  });

  it('has one light CTA', () => {
    const ctas = fixture.debugElement.queryAll(By.directive(RankingCtaComponent));
    expect(ctas.length).toBe(1);
    expect(ctas[0].componentInstance.variant()).toBe('light');
  });
});
