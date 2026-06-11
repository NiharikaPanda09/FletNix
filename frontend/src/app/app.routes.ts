import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { BrowseComponent } from './browse/browse';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'browse', component: BrowseComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/browse', pathMatch: 'full' },
  { path: '**', redirectTo: '/browse' }
];
