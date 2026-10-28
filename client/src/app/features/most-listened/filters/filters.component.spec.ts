import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FiltersComponent } from './filters.component';

describe('FiltersComponent', () => {
  let fixture: ComponentFixture<FiltersComponent>;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [FiltersComponent] }).compileComponents();
    fixture = TestBed.createComponent(FiltersComponent);
    fixture.componentRef.setInput('period', '1m');
    fixture.componentRef.setInput('mode', 'songs');
    el = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('renders both toggle groups', () => {
    expect(el.querySelectorAll('mat-button-toggle-group').length).toBe(2);
  });

  it('updates the period model when a toggle is set', () => {
    fixture.componentInstance.period.set('6m');
    expect(fixture.componentInstance.period()).toBe('6m');
  });
});
