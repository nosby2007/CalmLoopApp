import { Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from './shared/cart.service';
import { AuthService } from './auth/auth.service';
import { effect } from '@angular/core';
import { UserProfileService } from './shared/userProfile.service';
import { filter } from 'rxjs/operators';
import { ImageSearchService } from './shared/imag-search.service';
import { NgIf, NgFor } from '@angular/common'; // si tu utilises explicitement
// autres imports...
import { type SearchResponse, type SearchHit } from './shared/imag-search.service';



@Component({
  standalone: true,
  selector: 'app-root',
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  styles: [`
    :host { display:block; font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial; }
header { position: sticky; top: 0; z-index: 40; background:#0f172a; color:#fff; }
.container { max-width:1100px; margin:0 auto; padding:0 16px; }
.header-row { display:flex; align-items:center; gap:12px; height:56px; }
.brand { font-weight:800; color:#fff; text-decoration:none; letter-spacing:.2px; }
/* ===== Searchbar ===== */
.searchbar{
  position:relative; display:flex; align-items:center;
  width:min(560px, 100%); margin:0 12px; height:38px;
  background:#fff; border-radius:999px; padding:0 40px 0 36px;
  box-shadow: 0 8px 20px rgba(0,0,0,.10), inset 0 0 0 1px rgba(255,255,255,.08);
}
.searchbar:focus-within{ box-shadow: 0 10px 24px rgba(255,92,92,.25), inset 0 0 0 2px #ff7a7a; }

.searchbar__input{
  flex:1; height:100%; border:none; outline:none; background:transparent;
  font: inherit; color:#0f172a;
}
.searchbar__input::placeholder{ color:#94a3b8 }

.icon{ position:absolute; left:12px; color:#64748b; display:grid; place-items:center }
.icon-btn.camera{
  position:absolute; right:6px; height:30px; width:30px; border:none; border-radius:999px;
  background:#0f172a; color:#fff; display:grid; place-items:center; cursor:pointer;
  transition: transform .15s ease, filter .15s ease;
}
.icon-btn.camera:hover{ transform: translateY(-1px); filter: brightness(1.15) }

.searchbar__file{ position:absolute; inset:0; width:0; height:0; opacity:0; pointer-events:none }

/* Responsive placement */
@media (max-width: 900px){
  .searchbar{ margin:8px 0; width:100%; }
}

/* Option: assombrir input en dark header */
header .searchbar{ background:#f8fafc }

.nav-links { display:flex; align-items:center; gap:12px; margin-left:auto; }
a { color:#cbd5e1; text-decoration:none; padding:6px 10px; border-radius:8px; }
a.active, a:hover { background:#1e293b; color:#fff; }
.spacer { flex:1; }

.badge { background:#10b981; color:white; border-radius:999px; padding:2px 8px; font-size:12px; margin-left:6px; font-weight:800; }

/* Bouton profil “chip” */
.profile-btn{ display:inline-flex; align-items:center; gap:8px; padding:6px 10px; border-radius:999px;
  background: linear-gradient(90deg, #ff7a7a, #ff5c5c); color:#fff; font-weight:800; border:1px solid rgba(255,255,255,.15);
  box-shadow: 0 8px 20px rgba(255,92,92,.25); }
.profile-btn .avatar{ width:24px; height:24px; border-radius:999px; display:grid; place-items:center;
  background: rgba(255,255,255,.2); font-weight:900; }
.link.logout{ background:transparent; border:none; color:#cbd5e1; cursor:pointer; padding:6px 8px; border-radius:8px; }
.link.logout:hover{ background:#1e293b; color:#fff }
.ghost-btn{ color:#cbd5e1; border:1px solid rgba(255,255,255,.18); border-radius:999px; padding:6px 10px; }
.ghost-btn:hover{ background:#1e293b; color:#fff }

/* Burger (mobile) */
.hamburger{ margin-left:auto; background:transparent; border:none; cursor:pointer; display:none; padding:6px 8px; }
.hamburger span{ display:block; width:22px; height:2px; background:#fff; margin:5px 0; border-radius:2px; }

/* Panneau mobile (slide down) */
.overlay{ position:fixed; inset:0; background:rgba(0,0,0,.4); z-index:39; }
.mobile-panel{
  position:fixed; top:56px; left:0; right:0; z-index:40;
  background:#0b1220; display:flex; flex-direction:column; gap:6px; padding:10px 16px;
  transform: translateY(-8px); opacity:0; pointer-events:none; transition: transform .15s ease, opacity .15s ease;
  border-bottom:1px solid rgba(255,255,255,.06);
}
.mobile-panel a{ padding:10px 8px; border-radius:10px; }
.mobile-panel a:hover{ background:#111827 }
.mobile-panel .btn.full{ width:100%; padding:10px 12px; border-radius:10px; border:1px solid rgba(255,255,255,.18);
  background:#1f2937; color:#fff; text-align:center; font-weight:800; }
.mobile-panel.open{ transform: translateY(0); opacity:1; pointer-events:auto; }

/* Responsive */
@media (max-width: 900px){
  .nav-links{ display:none; }           /* cache les liens desktop */
  .hamburger{ display:block; }          /* montre le burger */
}
main { min-height: calc(100vh - 130px); }
footer { background:#0b1220; color:#94a3b8; padding:18px 0; }

  `],
  template: `
  <header (keydown.escape)="closeMenu()">
  <div class="container header-row">
    <!-- Marque -->
    <a
  routerLink="/"
  routerLinkActive="active"
  [routerLinkActiveOptions]="{ exact: true }"
  class="brand"
>
  CamLoop Baby
</a>

    <!-- Bouton burger (mobile) -->
    <button class="hamburger" (click)="toggleMenu()"
            [attr.aria-expanded]="menuOpen()" aria-controls="mobileMenu" aria-label="Ouvrir le menu">
      <span></span><span></span><span></span>
    </button>
    <!-- ...dans le header, juste après le logo -->
<form class="searchbar" (submit)="onTextSearch(q.value)" role="search" aria-label="Recherche produits">
  <!-- Loupe (décorative) -->
  <span class="icon magnifier" aria-hidden="true">
    <svg viewBox="0 0 24 24" width="18" height="18" focusable="false">
      <path fill="currentColor"
        d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16
           c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 5 1.5-1.5-5-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5
           14 7.01 14 9.5 11.99 14 9.5 14z"/>
    </svg>
  </span>

  <!-- Champ de saisie -->
  <input #q type="search" class="searchbar__input"
         placeholder="Rechercher un produit (ex: liniment, biberon…)"
         (keydown.enter)="onTextSearch(q.value)" />

  <!-- Fichier image (caché) -->
  <input #file type="file" class="searchbar__file"
         accept="image/*" capture="environment"
         (change)="onFile($event); onOpenImageSearch()" />

  <!-- Bouton caméra -->
  <button type="button" class="icon-btn camera" (click)="file.click()"
          aria-label="Rechercher par photo">
    <svg viewBox="0 0 24 24" width="18" height="18">
      <path fill="currentColor"
        d="M20 5h-3.2l-1.2-1.5A2 2 0 0 0 14.2 3H9.8a2 2 0 0 0-1.6.5L7 5H4a2 2 0 0 0-2 2v11a2
           2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm-8 14a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm0-2a3 3 0 1 0 0-6
           3 3 0 0 0 0 6Z"/>
    </svg>
  </button>
</form>

<div class="grid" *ngIf="results() as list">
  <div class="card" *ngFor="let p of (list || [])">
    <img [src]="p.image" [alt]="p.name" />
    <div class="card__body">
      <div class="title">{{ p.name }}</div>
      <div class="price">{{ p.price | currency:'USD' }}</div>
      <a class="btn" [routerLink]="['/boutique']" [queryParams]="{ id: p.productId }">Voir</a>
    </div>
  </div>
</div>


    <!-- Liens desktop -->
    <nav class="nav-links">
      <a routerLink="/apropos"  routerLinkActive="active">À propos</a>
      <a routerLink="/boutique" routerLinkActive="active">Boutique</a>
      <a routerLink="/contact"  routerLinkActive="active">Contact</a>

      <span class="spacer"></span>

      <a routerLink="/panier">Panier <span class="badge">{{ cartCount() }}</span></a>

      <!-- Profil -->
      <ng-container *ngIf="user(); else guest">
        <a routerLink="/profil" routerLinkActive="active" class="profile-btn">
          <span class="avatar">{{ initial() }}</span>
          <span class="label">Profil</span>
        </a>
        <button class="link logout" (click)="logout()">Déconnexion</button>
      </ng-container>
      <ng-template #guest>
        <a routerLink="/login" class="ghost-btn">Se connecter</a>
        <a routerLink="/register" class="ghost-btn">Créer un compte</a>
      </ng-template>
    </nav>
  </div>

  <!-- Overlay clic-outside -->
  <div class="overlay" *ngIf="menuOpen()" (click)="closeMenu()"></div>

  <!-- Panneau mobile -->
  <nav id="mobileMenu" class="mobile-panel" [class.open]="menuOpen()">
    <a routerLink="/apropos"  (click)="closeMenu()" routerLinkActive="active">À propos</a>
    <a routerLink="/boutique" (click)="closeMenu()" routerLinkActive="active">Boutique</a>
    <a routerLink="/contact"  (click)="closeMenu()" routerLinkActive="active">Contact</a>
    <a routerLink="/panier"   (click)="closeMenu()">Panier <span class="badge">{{ cartCount() }}</span></a>
    <hr />
    <ng-container *ngIf="user(); else mGuest">
      <a routerLink="/profil" (click)="closeMenu()" class="profile-btn">
        <span class="avatar">{{ initial() }}</span><span class="label">Profil</span>
      </a>
      <button class="btn full" (click)="logout(); closeMenu()">Déconnexion</button>
    </ng-container>
    <ng-template #mGuest>
      <a routerLink="/login"    (click)="closeMenu()" class="btn full">Se connecter</a>
      <a routerLink="/register" (click)="closeMenu()" class="btn full">Créer un compte</a>
    </ng-template>
  </nav>
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
  private router = inject(Router);
  private imgSearch = inject(ImageSearchService);           // ✅ corrige "imgSearch does not exist"
  results = signal<SearchHit[] | null>(null);    

  public logout(): void {
    this.authService.logout();
  }
  private api = inject(ImageSearchService);
  file: File | null = null;

  onFile(e: Event) {
    const input = e.target as HTMLInputElement;
    this.file = input.files?.[0] ?? null;
  }
  constructor() {
    // À chaque connexion: s'assure que le doc /users/{uid} existe
    effect(() => {
      const u = this.auth.user();
      if (u) this.profiles.ensureForCurrentUser();
    });
    // Ferme le menu au changement de route
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => this.closeMenu());
  }

    // État du menu mobile
    menuOpen = signal(false);
    toggleMenu() { this.menuOpen.update(v => !v); }
    closeMenu() { this.menuOpen.set(false); }
  
  // ✅ Initiale pour l’avatar (displayName > email)
  initial = computed(() => {
    const u = this.user();
    const name = (u?.displayName && u.displayName.trim())
      || (u?.email ? u.email.split('@')[0] : '')
      || 'U';
    return name.charAt(0).toUpperCase();
  });

  onSubmit(e: Event) {
    e.preventDefault();
    if (!this.file) return;
    this.api.search(this.file).subscribe(({ hits }) => this.results.set(hits));
  }

  onTextSearch(q: string) {
    const query = (q || '').trim();
    if (!query) return;
    // ferme le menu mobile si besoin
    if (this.menuOpen) this.menuOpen.set?.(false);
    // Navigue avec param ?q=
    // (importe Router si pas déjà fait)
    // this.router.navigate(['/boutique'], { queryParams: { q: query } });
    // …ou déclenche ta recherche texte existante
  }

  // Lance la recherche-image dès que le fichier est choisi
  onOpenImageSearch() {
    if (!this.file) return;
    this.imgSearch.search(this.file).subscribe((res: SearchResponse) => {  // ✅ corrige "res implicitly any"
      this.results.set(res.hits);
      this.menuOpen?.set?.(false);
    });
  }
  
}
