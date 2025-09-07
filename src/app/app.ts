import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from './shared/cart.service';
import { AuthService } from './auth/auth.service';
import { effect } from '@angular/core';
import { UserProfileService } from './shared/userProfile.service';



@Component({
  standalone: true,
  selector: 'app-root',
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  styles: [`
    :host { display:block; font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial; }
    header { position: sticky; top: 0; z-index: 10; background:#0f172a; color:#fff; }
    .container { max-width: 1100px; margin: 0 auto; padding: 0 16px; }
    nav { display:flex; align-items:center; gap:16px; padding:12px 0; }
    .brand { font-weight:700; letter-spacing:.3px; text-decoration:none; color:#fff; }
    a { color:#cbd5e1; text-decoration:none; padding:6px 10px; border-radius:8px; }
    a.active, a:hover { background:#1e293b; color:#fff; }
    main { min-height: calc(100vh - 130px); }
    footer { background:#0b1220; color:#94a3b8; padding:18px 0; }
    .spacer { flex:1; }
    .badge { background:#10b981; color:white; border-radius:999px; padding:2px 8px; font-size:12px; margin-left:6px; }
    /* Bouton profil “chip” */
.profile-btn{
  display:inline-flex; align-items:center; gap:8px;
  padding:6px 10px; border-radius:999px;
  background: linear-gradient(90deg, #ff7a7a, #ff5c5c);
  color:#fff; text-decoration:none; font-weight:800;
  border:1px solid rgba(255,255,255,.15);
  box-shadow: 0 8px 20px rgba(255,92,92,.25);
  transition: transform .15s ease, box-shadow .15s ease, filter .15s ease;
}
.profile-btn:hover{ transform: translateY(-1px); box-shadow: 0 12px 28px rgba(255,92,92,.35) }
.profile-btn.active{ filter: brightness(1.05) }

.profile-btn .avatar{
  width:24px; height:24px; border-radius:999px;
  display:grid; place-items:center;
  background: rgba(255,255,255,.2);
  font-weight:900; letter-spacing:.2px;
}
.profile-btn .label{ line-height:1 }

.link.logout{
  background:transparent; border:none; color:#cbd5e1; cursor:pointer;
  padding:6px 8px; border-radius:8px; margin-left:6px; font-weight:700;
}
.link.logout:hover{ background:#1e293b; color:#fff }

/* Boutons invités (login/register) */
.ghost-btn{
  color:#cbd5e1; text-decoration:none; padding:6px 10px; border-radius:999px;
  border:1px solid rgba(255,255,255,.18);
}
.ghost-btn:hover{ background:#1e293b; color:#fff }
  `],
  template: `
    <header>
      <div class="container">
        <nav>
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}" class="brand">CamLoop Baby</a>
          <a routerLink="/apropos"  routerLinkActive="active">À propos</a>
          <a routerLink="/boutique" routerLinkActive="active">Boutique</a>
          <a routerLink="/contact"  routerLinkActive="active">Contact</a>
          <div class="spacer"></div>
          <!-- 👇 Badge qui ouvre le panier -->
          <span><a routerLink="/panier" aria-label="Voir le panier">
    Panier <span class="badge">{{ cartCount() }}</span>
  </a></span>
 <!-- ✅ Profil stylé -->
<ng-container *ngIf="user(); else guest">
  <a routerLink="/profil"
     routerLinkActive="active"
     class="profile-btn"
     aria-label="Aller au profil">
    <span class="avatar">{{ initial() }}</span>
    <span class="label">Profil</span>
  </a>
  <button class="link logout" (click)="logout()" aria-label="Se déconnecter">Déconnexion</button>
</ng-container>

<ng-template #guest>
  <a routerLink="/login" class="ghost-btn">Se connecter</a>
  <a routerLink="/register" class="ghost-btn">Créer un compte</a>
</ng-template>
          
        </nav>
      </div>
    </header>

    <main class="container">
      <router-outlet></router-outlet>
    </main>

    <footer>
      <div class="container">© {{year}} CamLoop Baby</div>
    </footer>
  `
})
export class AppComponent {
  private cart = inject(CartService);
  year = new Date().getFullYear();
  cartCount = computed(() => this.cart['items']().reduce((acc: any, it: { qty: any; }) => acc + it.qty, 0));
  private profiles = inject(UserProfileService);
  private auth = inject(AuthService);
  public authService = inject(AuthService);
  user = this.auth.user; 

  public logout(): void {
    this.authService.logout();
  }
  constructor() {
    // À chaque connexion: s'assure que le doc /users/{uid} existe
    effect(() => {
      const u = this.auth.user();
      if (u) this.profiles.ensureForCurrentUser();
    });
  }
  // ✅ Initiale pour l’avatar (displayName > email)
  initial = computed(() => {
    const u = this.user();
    const name = (u?.displayName && u.displayName.trim())
      || (u?.email ? u.email.split('@')[0] : '')
      || 'U';
    return name.charAt(0).toUpperCase();
  });
}
