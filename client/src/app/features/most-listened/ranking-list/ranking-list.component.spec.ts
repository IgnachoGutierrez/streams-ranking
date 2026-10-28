import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RankingListComponent, RankingListItem } from './ranking-list.component';

describe('RankingListComponent', () => {
  let fixture: ComponentFixture<RankingListComponent>;
  let el: HTMLElement;

  const items: RankingListItem[] = [
    { id: 1, title: 'Stray Dogs', subtitle: 'Nothing But Thieves' },
    { id: 2, title: 'Psycho Shit', subtitle: 'The Strokes' },
    { id: 3, title: 'Kendrick Lamar', subtitle: 'Hip hop', meta: '3 canciones en tu top' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [RankingListComponent] }).compileComponents();
    fixture = TestBed.createComponent(RankingListComponent);
    fixture.componentRef.setInput('items', items);
    el = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('renders one row per item', () => {
    expect(el.querySelectorAll('mat-list-item').length).toBe(items.length);
  });

  it('shows the meta text when present', () => {
    expect(el.textContent).toContain('3 canciones en tu top');
  });

  it('numbers rows by position, not by id', () => {
    const badges = Array.from(el.querySelectorAll('.mat-badge-content')).map((b) => b.textContent?.trim());
    expect(badges).toEqual(['1', '2', '3']);
  });
});
