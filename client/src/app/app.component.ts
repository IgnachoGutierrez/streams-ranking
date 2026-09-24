import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'streams-ranking-app';

  private readonly auth = inject(AuthService);

  readonly token = this.auth.token;

  hasToken = computed(() => {
    if (this.token()) {
      return 'Tiene token';
    }

    return 'No tiene token';
  });
}
