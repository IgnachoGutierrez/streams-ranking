import { inject, Service } from "@angular/core";
import { httpResource, HttpResourceRef } from "@angular/common/http";
import { AuthService } from "../../core/auth/auth.service";
import { environment } from "../../../environments/environment";
import { RankingListItem } from "./ranking-list/ranking-list.component";
import { Mode, Period } from "./filters/filters.component";

const API_URL = environment.apiUrl;

type TimeRange = 'short_term' | 'medium_term' | 'long_term';
const TIME_RANGE: Record<Period, TimeRange> = {
  '1m': 'short_term',
  '6m': 'medium_term',
  all: 'long_term',
};

export interface TopResponse {
  items: RankingListItem[];
}

export interface TopQuery {
  mode: Mode;
  period: Period;
  limit?: number;
}

@Service()
export class TopService {
  private readonly auth = inject(AuthService);

  /** Must be called in an injection context (e.g. a field initializer), so the
   *  resource is tied to the caller's lifetime, not the root injector. */
  top(query: () => TopQuery): HttpResourceRef<TopResponse | undefined> {
    return httpResource<TopResponse>(() => {
        if (!this.auth.token()) return undefined;

        const { mode, period, limit = 50 } = query();
        
        return {
            url: `${API_URL}/top/${mode}`,
            params: { 
                time_range: TIME_RANGE[period], 
                limit 
            },
        };

    });
  }
}