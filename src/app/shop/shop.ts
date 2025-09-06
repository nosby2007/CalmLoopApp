import { Component, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CartService } from '../shared/cart.service';
import { PRODUCTS, type Product } from '../shared/products';

@Component({
  standalone: true,
  selector: 'app-shop',
  imports: [CommonModule, CurrencyPipe],
  styles: [`
    .grid { display:grid; grid-template-columns: repeat(4, 1fr); gap:16px; }
    .card { border:1px solid #e5e7eb; border-radius:14px; overflow:hidden; display:flex; flex-direction:column; background:#fff; }
    .card img { width:100%; height:180px; object-fit:cover; }
    .card .body { padding:12px; display:flex; flex-direction:column; gap:8px; flex:1; }
    .title { font-weight:600; }
    .price { color:#16a34a; font-weight:700; }
    .actions { display:flex; gap:8px; }
    .btn { cursor:pointer; border:none; border-radius:10px; padding:8px 10px; font-weight:600; }
    .btn.add { background:#0ea5e9; color:#fff; }
    .panel { margin:24px 0; padding:12px; background:#f1f5f9; border-radius:12px; }
    @media (max-width: 1024px){ .grid{ grid-template-columns: repeat(2, 1fr);} }
    @media (max-width: 640px){ .grid{ grid-template-columns: 1fr; } }
  `],
  template: `
    <h2>La boutique</h2>

    <div class="panel" *ngIf="cart.items().length">
      <b>Panier:</b> {{cart.items().length}} article(s) — Total: {{ cart.total() | currency:'USD' }}
      <button class="btn" (click)="cart.clear()">Vider</button>
    </div>

    <div class="grid">
      <div class="card" *ngFor="let p of products">
        <img [src]="p.image" [alt]="p.name">
        <div class="body">
          <div class="title">{{ p.name }}</div>
          <div class="desc">{{ p.description }}</div>
          <div class="price">{{ p.price | currency:'USD' }}</div>
          <div class="actions">
            <button class="btn add" (click)="add(p)">Ajouter</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ShopComponent {
  cart = inject(CartService);
  products: Product[] = PRODUCTS;
  add(p: Product) { this.cart.add(p); }
}
