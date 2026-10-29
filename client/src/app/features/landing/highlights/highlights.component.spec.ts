import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HighlightsComponent } from './highlights.component';

describe('HighlightsComponent', () => {
  let fixture: ComponentFixture<HighlightsComponent>;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HighlightsComponent] }).compileComponents();
    fixture = TestBed.createComponent(HighlightsComponent);
    el = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('renders the heading', () => {
    expect(el.querySelector('h2')?.textContent).toBe('Tu música más escuchada en Spotify');
  });

  it('shows the Spotify, Top 50, 3 períodos and Gratis chips in the heading', () => {
    const chips = el.querySelectorAll('.highlights__heading .highlights__chips mat-chip');
    const labels = Array.from(chips).map((c) => c.querySelector('.mdc-evolution-chip__text-label')?.textContent?.trim());
    expect(labels).toEqual(['Spotify', 'Top 50', '3 períodos', 'Gratis']);
  });

  it('places the chips after the heading text', () => {
    const order = Array.from(el.querySelector('.highlights__heading')!.children).map((c) => c.tagName.toLowerCase());
    expect(order).toEqual(['h2', 'p', 'div']);
  });

  it('gives each chip its icon', () => {
    const icons = Array.from(el.querySelectorAll('.highlights__chips mat-icon')).map(
      (i) => i.getAttribute('data-mat-icon-name') ?? i.textContent?.trim(),
    );
    expect(icons).toEqual(['spotify', 'format_list_numbered', 'date_range', 'money_off']);
  });

  it('puts the decorative Spotify icon inside the chip', () => {
    const icon = el.querySelector('.highlights__heading mat-chip mat-icon.highlights__spotify');
    expect(icon?.getAttribute('data-mat-icon-name')).toBe('spotify');
    expect(icon?.getAttribute('aria-hidden')).toBe('true');
    expect(icon?.querySelector('svg')).not.toBeNull();
  });

  it('renders 3 highlights with the titles in order', () => {
    const titles = Array.from(el.querySelectorAll('.highlight h3')).map((h) => h.textContent?.trim());
    expect(titles).toEqual(['Top artistas + canciones', 'Rankings por tiempo', 'Seguridad garantizada']);
  });

  it('gives each highlight its icon', () => {
    const icons = Array.from(el.querySelectorAll('.highlight mat-icon')).map((i) => i.textContent?.trim());
    expect(icons).toEqual(['format_list_numbered', 'filter_list', 'lock']);
  });

  it('is the #highlights anchor target', () => {
    expect(el.querySelector('section')?.id).toBe('highlights');
  });
});
