import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, UserSession } from '../services/auth.service';
import { ShowService, Show } from '../services/show.service';

@Component({
  selector:    'app-browse',
  standalone:  true,
  imports:     [CommonModule, FormsModule],
  templateUrl: './browse.html',
})
export class BrowseComponent implements OnInit {
  currentUser:   UserSession | null = null;

  shows:         Show[] = [];
  currentPage    = 1;
  readonly limit = 15;
  totalItems     = 0;
  totalPages     = 0;

  searchQuery    = '';
  selectedType   = ''; // '' | 'Movie' | 'TV Show'

  loading        = false;
  selectedShow:  Show | null = null;
  loadingDetail  = false;

  constructor(
    private readonly authService: AuthService,
    private readonly showService: ShowService,
    private readonly router:      Router,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadShows();
  }

  loadShows(): void {
    this.loading = true;
    this.showService.getShows({
      page:    this.currentPage,
      limit:   this.limit,
      search:  this.searchQuery,
      type:    this.selectedType,
      userAge: this.currentUser?.age,
    }).subscribe({
      next: ({ shows, currentPage, totalItems, totalPages }) => {
        this.shows       = shows;
        this.currentPage = currentPage;
        this.totalItems  = totalItems;
        this.totalPages  = totalPages;
        this.loading     = false;
      },
      error: (err) => {
        console.error('[browse] Failed to load shows:', err);
        this.loading = false;
      },
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadShows();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.currentPage = 1;
    this.loadShows();
  }

  filterType(type: string): void {
    this.selectedType = type;
    this.currentPage  = 1;
    this.loadShows();
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadShows();
  }

  getPageNumbers(): number[] {
    const MAX_PAGES = 5;
    let start = Math.max(1, this.currentPage - 2);
    let end   = Math.min(this.totalPages, start + MAX_PAGES - 1);

    if (end - start < MAX_PAGES - 1) {
      start = Math.max(1, end - MAX_PAGES + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  viewShowDetails(show: Show): void {
    this.loadingDetail = true;
    this.selectedShow  = null;

    this.showService.getShowById(show._id).subscribe({
      next: (res) => {
        this.selectedShow  = res;
        this.loadingDetail = false;
      },
      error: (err) => {
        console.error('[browse] Failed to fetch show details:', err);
        this.loadingDetail = false;
      },
    });
  }

  closeShowDetails(): void {
    this.selectedShow = null;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
