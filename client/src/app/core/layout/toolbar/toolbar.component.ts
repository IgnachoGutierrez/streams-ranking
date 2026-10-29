import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RankingCtaComponent } from '../../../shared/ranking-cta/ranking-cta.component';

interface NavLink {
  label: string;
  fragment: string;
}

const NAV_LINKS: readonly NavLink[] = [
  { label: 'Características', fragment: 'highlights' },
  { label: 'Cómo funciona', fragment: 'how-it-works' },
];

@Component({
  selector: 'app-toolbar',
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
    RankingCtaComponent,
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent {
  protected readonly links = NAV_LINKS;
}
