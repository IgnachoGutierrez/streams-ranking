import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-ranking-cta',
  imports: [MatButtonModule],
  templateUrl: './ranking-cta.component.html',
  styleUrl: './ranking-cta.component.scss',
  host: { '[class]': '"cta cta--" + variant()' },
})
export class RankingCtaComponent {
  readonly variant = input<'light' | 'gradient'>('light');
  protected readonly loginUrl = `${environment.apiUrl}/auth/login`;
}
