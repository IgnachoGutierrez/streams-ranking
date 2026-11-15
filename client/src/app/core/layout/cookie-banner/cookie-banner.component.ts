import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { AnalyticsService } from '../../analytics/analytics.service';

/** Asks for analytics consent. Hidden when analytics is off or the user has chosen. */
@Component({
  selector: 'app-cookie-banner',
  imports: [MatButtonModule],
  templateUrl: './cookie-banner.component.html',
  styleUrl: './cookie-banner.component.scss',
})
export class CookieBannerComponent {
  private readonly analytics = inject(AnalyticsService);

  protected readonly visible = computed(
    () => this.analytics.enabled() && this.analytics.consent() === null,
  );

  protected accept(): void {
    this.analytics.grantConsent();
  }

  protected reject(): void {
    this.analytics.denyConsent();
  }
}
