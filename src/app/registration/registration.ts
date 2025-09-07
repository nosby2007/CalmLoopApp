import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { RegistrationService } from './registration.service';


@Component({
  selector: 'app-registration',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registration.html',
  styleUrl: './registration.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RegistrationService],
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loading = signal(false);
  error = signal<string | null>(null);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirm: ['', [Validators.required]]
  });

  async submit() {
    this.error.set(null);
    if (this.form.invalid) return;
    const { name, email, password, confirm } = this.form.value as any;
    if (password !== confirm) { this.error.set('Les mots de passe ne correspondent pas.'); return; }

    this.loading.set(true);
    try {
      await this.auth.register(name, email, password);
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
      case 'auth/email-already-in-use': return 'Cet email est déjà utilisé.';
      case 'auth/weak-password': return 'Mot de passe trop faible (min. 6 caractères).';
      default: return 'Inscription impossible. Vérifiez vos informations.';
    }
  }
}
