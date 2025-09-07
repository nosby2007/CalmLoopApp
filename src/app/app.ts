import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from './shared/cart.service';

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
}
