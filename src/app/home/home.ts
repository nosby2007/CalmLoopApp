import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [RouterLink],
  styles: [`
    .hero { display:grid; grid-template-columns: 1.2fr 1fr; gap:24px; padding:40px 0; align-items:center; }
    .hero img { width:100%; border-radius:16px; box-shadow: 0 10px 30px rgba(0,0,0,.15); }
    .cta { display:flex; gap:12px; margin-top:16px; }
    .btn { padding:10px 16px; border-radius:10px; text-decoration:none; font-weight:600; }
    .btn.primary { background:#0ea5e9; color:#fff; }
    .btn.secondary { background:#e2e8f0; color:#0f172a; }
    @media (max-width: 800px){ .hero { grid-template-columns: 1fr; } }
  `],
  template: `
    <section class="hero">
      <div>
        <h1>Bienvenue sur <strong>CamLoop Shop</strong> 🛍️</h1>
        <p>Une boutique démo construite en <b>Angular Standalone</b> : simple, rapide et moderne.</p>
        <div class="cta">
          <a routerLink="/boutique" class="btn primary">Voir la boutique</a>
          <a routerLink="/apropos" class="btn secondary">En savoir plus</a>
        </div>
      </div>
      <img src="https://picsum.photos/seed/shop/900/600" alt="Hero">
    </section>
  `
})
export class HomeComponent {}
