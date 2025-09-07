import { Component, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../shared/cart.service';

@Component({
  standalone: true,
  selector: 'app-checkout',
  imports: [CommonModule, RouterLink, CurrencyPipe],
  template: `
    <section class="container">
      <h1>Paiement</h1>
      <p>Total à payer : <b>{{ cart.total() | currency:'USD' }}</b></p>

      <p class="muted">Cette page est un <i>stub</i>. Branche ici ton provider (Stripe, PayPal, Flutterwave, etc.).</p>

      <div class="actions">
        <button class="btn primary" (click)="startPayment()">Procéder au paiement</button>
        <a class="btn" routerLink="/panier">Retour au panier</a>
      </div>
    </section>
  `,
  styles: [`
    .container{ max-width:800px; margin:0 auto; padding:24px 16px }
    .muted{ color:#64748b }
    .actions{ display:flex; gap:10px; margin-top:12px }
    .btn{ padding:10px 14px; border-radius:12px; border:1px solid rgba(31,41,55,.12); background:#f8fafc; cursor:pointer; font-weight:800 }
    .btn.primary{ background:#111827; color:#fff }
  `]
})
export class CheckoutComponent {
  cart = inject(CartService);

  startPayment() {
    // 🔗 Branche ici ton provider. Exemple :
    // window.location.href = 'https://mon-backend.example.com/create-checkout-session';

    alert('Paiement non connecté — branche ton provider ici.');
  }
}
