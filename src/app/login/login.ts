import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';


@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loading = signal(false);
  error = signal<string | null>(null);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  async submit() {
    this.error.set(null);
    if (this.form.invalid) return;
    this.loading.set(true);
    try {
      const { email, password } = this.form.value as { email: string; password: string; };
      await this.auth.login(email, password).toPromise();
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/boutique';
      this.router.navigateByUrl(returnUrl);
    } catch (e: any) {
      this.error.set(this.mapError(e?.code));
    } finally {
      this.loading.set(false);
    }
  }

  async google() {
    this.error.set(null);
    this.loading.set(true);
    try {
      await this.auth.googleLogin().toPromise();
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/boutique';
      this.router.navigateByUrl(returnUrl);
    } catch (e: any) {
      this.error.set(this.mapError(e?.code));
    } finally {
      this.loading.set(false);
    }
  }

  private mapError(code?: string): string {
    switch (code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found': return 'Identifiants invalides.';
      case 'auth/too-many-requests': return 'Trop de tentatives. Réessayez plus tard.';
      default: return 'Connexion impossible. Vérifiez vos informations.';
    }
  }
}
