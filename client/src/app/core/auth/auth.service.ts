import { httpResource } from "@angular/common/http";
import { computed, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

interface AuthMe { authenticated: boolean; }
interface AuthToken { accessToken: string; }

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // 1) Who am I? Runs once on first injection; call refresh() to refetch.
  private readonly me = httpResource<AuthMe>(
    () => ({ url: `${environment.apiUrl}/auth/me` }),
    {
      // replaces the tap() — inspect/validate the real shape here
      parse: (raw) => {
        console.log('[auth/me]', raw);
        return raw as AuthMe;
      },
    },
  );

  // 2) Access token — only requested once `me` reports authenticated.
  //    Returning undefined keeps this resource idle (no request, value() === undefined).
  private readonly session = httpResource<AuthToken>(() =>
    this.me.value()?.authenticated
      ? { url: `${environment.apiUrl}/auth/token` }
      : undefined,
  );

  readonly token = computed<string | null>(() => this.session.value()?.accessToken ?? null);
  readonly isAuthenticated = computed(() => this.token() !== null);

  readonly authLoading = computed(() => this.me.isLoading() || this.session.isLoading());
  readonly authError = computed(() => this.me.error() ?? this.session.error());

  refresh(): void {
    this.me.reload();
    // `session` re-fires automatically when me.value() changes (fresh parsed object
    // each time). Call this.session.reload() instead/also to refresh just the token.
  }
}