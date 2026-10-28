import { Component, input } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatListModule } from '@angular/material/list';
import { RankingItem } from '../most-listened.mock-data';

export interface RankingListItem extends RankingItem {
  /** Trailing text for the row (e.g. a crossover count). */
  meta?: string | null;
}

/** Renders a ranked list of songs or artists — identical markup either way, driven
 *  entirely by `items`. Rank order and avatar vs. initials are decided by the data,
 *  so this component has no notion of "songs" or "artists". */
@Component({
  selector: 'app-ranking-list',
  imports: [MatBadgeModule, MatListModule],
  templateUrl: './ranking-list.component.html',
  styleUrl: './ranking-list.component.scss',
})
export class RankingListComponent {
  readonly items = input.required<readonly RankingListItem[]>();

  protected colorFor(id: number): string {
    const hue = (id * 47) % 360;
    return `linear-gradient(135deg, hsl(${hue} 70% 55%), hsl(${(hue + 40) % 360} 70% 40%))`;
  }
}
