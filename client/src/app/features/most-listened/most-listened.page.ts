import { Component, computed, inject, signal } from '@angular/core';
import { FiltersComponent, Mode, Period } from './filters/filters.component';
import { RankingListComponent, RankingListItem } from './ranking-list/ranking-list.component';
import { TopService } from './top.service';

/** Below this, the crossover count isn't telling enough to show. */
const MIN_CROSSOVER = 2;

@Component({
  selector: 'app-most-listened-page',
  imports: [FiltersComponent, RankingListComponent],
  templateUrl: './most-listened.page.html',
  styleUrl: './most-listened.page.scss',
})
export class MostListenedPage {
  private readonly topService = inject(TopService);

  readonly period = signal<Period>('1m');
  readonly mode = signal<Mode>('songs');
  
  /** Top songs for the period. Depends only on `period` (not `mode`), so switching
   *  modes never re-requests them: the songs view lists them and the artists view
   *  reuses them for the crossover count. */
  private readonly songs = this.topService.top(() => ({ mode: 'songs', period: this.period() }));

  /** Top artists for the period, fetched only in artists mode. */
  private readonly artists = this.topService.top(() =>
    this.mode() === 'artists' ? { mode: 'artists', period: this.period() } : undefined,
  );

  /** Rows for the active mode, with each artist's crossover count resolved into
   *  `meta` text — the ranking list just renders `meta`, with no notion of what it
   *  means. `undefined` while the active list is loading. */
  protected readonly displayItems = computed<RankingListItem[] | undefined>(() => {
    if (this.mode() === 'songs') {
      return this.songs.hasValue() ? this.songs.value().items : undefined;
    }

    if (!this.artists.hasValue()) {
      return undefined;
    }

    return this.artists.value().items.map((artist) => ({ ...artist, meta: this.metaFor(artist) }));
  });

  /** `meta` text for an artist row, or `null` below MIN_CROSSOVER — "top artist,
   *  1 song" isn't worth showing — or while the songs are still loading. */
  private metaFor(artist: RankingListItem): string | null {
    if (!this.songs.hasValue()) {
      return null;
    }

    const count = this.songs.value().items.filter((song) => song.subtitle === artist.title).length;
    
    return count >= MIN_CROSSOVER ? `${count} canciones en tu top` : null;
  }
}
