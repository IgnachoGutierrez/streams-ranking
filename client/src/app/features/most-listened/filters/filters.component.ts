import { Component, model } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';

export type Mode = 'songs' | 'artists';
export type Period = '1m' | '6m' | 'all';

@Component({
  selector: 'app-filters',
  imports: [MatButtonToggleModule, MatIconModule],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss',
})
export class FiltersComponent {
  readonly period = model.required<Period>();
  readonly mode = model.required<Mode>();
}
