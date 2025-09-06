// src/app/home/home.ts
import { Component, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../shared/cart.service';
import { Product, PRODUCTS } from '../shared/products';

// 👉 Choisis l'import qui correspond à TON fichier :
// - si ton fichier est src/app/shared/product.ts (singulier) :

// - sinon, si c'est src/app/shared/products.ts (pluriel), utilise ceci à la place :
// import { PRODUCTS, type Product } from '../shared/products';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, RouterLink, CurrencyPipe],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {
  private cart = inject(CartService);

  // 🔁 On lit la liste locale (pas d’Observable)
  products: Product[] = PRODUCTS;

  add(p: Product) {
    this.cart.add(p);
  }
}
