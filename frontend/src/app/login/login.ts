import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector:    'app-login',
  standalone:  true,
  imports:     [CommonModule, FormsModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  isLoginMode = true;

  email    = '';
  password = '';
  age:       number | null = null;

  errorMessage   = '';
  successMessage = '';
  loading        = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router:      Router,
  ) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/browse']);
    }
  }

  toggleMode(): void {
    this.isLoginMode     = !this.isLoginMode;
    this.errorMessage    = '';
    this.successMessage  = '';
    this.email           = '';
    this.password        = '';
    this.age             = null;
  }

  onSubmit(): void {
    this.errorMessage   = '';
    this.successMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password.';
      return;
    }

    if (!this.isLoginMode && (this.age === null || this.age < 0)) {
      this.errorMessage = 'Please enter a valid age.';
      return;
    }

    this.loading = true;
    this.isLoginMode ? this.doLogin() : this.doRegister();
  }

  // ─── Private ───────────────────────────────────────────────────────────────

  private doLogin(): void {
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/browse']);
      },
      error: (err) => {
        this.loading      = false;
        this.errorMessage = err.error?.message ?? 'Login failed. Please check your credentials.';
      },
    });
  }

  private doRegister(): void {
    this.authService.register({
      email:    this.email,
      password: this.password,
      age:      this.age as number,
    }).subscribe({
      next: () => {
        this.loading        = false;
        this.successMessage = 'Account created! You can now sign in.';
        setTimeout(() => {
          this.isLoginMode    = true;
          this.successMessage = '';
          this.password       = '';
        }, 1500);
      },
      error: (err) => {
        this.loading      = false;
        this.errorMessage = err.error?.message ?? 'Registration failed. Try a different email.';
      },
    });
  }
}
