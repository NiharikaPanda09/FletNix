import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Show {
  _id: string;
  show_id: string;
  type: string;
  title: string;
  director?: string;
  cast?: string;
  country?: string;
  date_added?: string;
  release_year: number;
  rating?: string;
  duration?: string;
  listed_in?: string;
  description?: string;
}

export interface PaginatedShowsResponse {
  shows: Show[];
  currentPage: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface ShowsFilter {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  userAge?: number;
}

@Injectable({ providedIn: 'root' })
export class ShowService {
  private readonly apiUrl = `${environment.apiUrl}/shows`;

  constructor(private http: HttpClient) {}

  getShows(filters: ShowsFilter = {}): Observable<PaginatedShowsResponse> {
    let params = new HttpParams();

    const entries: [string, string | number | undefined][] = [
      ['page', filters.page],
      ['limit', filters.limit],
      ['search', filters.search],
      ['type', filters.type],
      ['userAge', filters.userAge],
    ];

    for (const [key, value] of entries) {
      if (value !== undefined) params = params.set(key, String(value));
    }

    return this.http.get<PaginatedShowsResponse>(this.apiUrl, { params });
  }

  getShowById(id: string): Observable<Show> {
    return this.http.get<Show>(`${this.apiUrl}/${id}`);
  }
}
