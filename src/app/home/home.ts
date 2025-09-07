// src/app/home/home.ts
import { Component, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../shared/cart.service';
import { Product, PRODUCTS, CATEGORIES, Category } from '../shared/products';


@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, RouterLink, CurrencyPipe],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {
  private cart = inject(CartService);

  products: Product[] = PRODUCTS;
  categories = CATEGORIES;
  selectedCat: 'all' | Category = 'all';

  get shown(): Product[] {
    return this.selectedCat === 'all'
      ? this.products
      : this.products.filter(p => p.category === this.selectedCat);
  }

  labelOf(id: Category): string {
    return this.categories.find(c => c.id === id)?.label ?? id;
  }

  add(p: Product) {
    this.cart.add(p);
  }
}
