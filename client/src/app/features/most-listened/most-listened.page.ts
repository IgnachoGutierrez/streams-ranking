import { Component, computed, signal } from '@angular/core';
import { FiltersComponent, Mode, Period } from './filters/filters.component';
import { RankingListComponent, RankingListItem } from './ranking-list/ranking-list.component';
import { ARTISTS, RankingItem, SONGS } from './most-listened.mock-data';

/** Below this, the crossover count isn't telling enough to show. */
const MIN_CROSSOVER = 2;

@Component({
  selector: 'app-most-listened-page',
  imports: [FiltersComponent, RankingListComponent],
  templateUrl: './most-listened.page.html',
  styleUrl: './most-listened.page.scss',
})
export class MostListenedPage {
  protected readonly period = signal<Period>('1m');
  protected readonly mode = signal<Mode>('songs');

  protected readonly items = computed(() => {
    const list = this.mode() === 'songs' ? SONGS : ARTISTS;
    return list.slice(0, this.limitFor(list));
  });

  /** `items()` with each artist's crossover count resolved into `meta` text — the
   *  ranking list just renders `tag`/`meta`, with no notion of what they mean. */
  protected readonly displayItems = computed<RankingListItem[]>(() =>
    this.items().map((item) => ({ ...item, meta: this.metaFor(item) })),
  );

  /** Songs for the same period as `items()`, regardless of the active mode — used to
   *  count how many of an artist's tracks also show up in the top-songs list. */
  private readonly periodSongs = computed(() => SONGS.slice(0, this.limitFor(SONGS)));

  /** `meta` text for an artist row, or `null` below MIN_CROSSOVER — "top artist,
   *  1 song" isn't worth showing — and always `null` for songs. */
  private metaFor(artist: RankingItem): string | null {
    if (this.mode() !== 'artists') {
      return null;
    }
    const count = this.periodSongs().filter((song) => song.subtitle === artist.title).length;
    return count >= MIN_CROSSOVER ? `${count} canciones en tu top` : null;
  }

  private limitFor(list: readonly RankingItem[]): number {
    return this.period() === '1m' ? 10 : this.period() === '6m' ? 15 : list.length;
  }
}
