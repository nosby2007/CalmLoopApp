import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { CartService } from '../shared/cart.service';
import { Product, PRODUCTS, CATEGORIES, Category } from '../shared/products';


@Component({
  standalone: true,
  selector: 'app-shop',
  imports: [CommonModule, CurrencyPipe, NgFor, NgIf],
  templateUrl: './shop.html',
  styleUrls: ['./shop.css']
})
export class ShopComponent implements OnInit {
  private cart = inject(CartService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  products: Product[] = PRODUCTS;
  categories = CATEGORIES;
  selectedCat: 'all' | Category = 'all';

  ngOnInit() {
    // Lis la catégorie depuis l'URL ?cat=soins (pratique à partager)
    this.route.queryParamMap.subscribe((params) => {
      const cat = params.get('cat') as Category | null;
      this.selectedCat = cat && this.categories.some(c => c.id === cat) ? cat : 'all';
    });
  }

  setCat(cat: 'all' | Category) {
    this.selectedCat = cat;
    // Mets à jour l'URL (sans recharger la page)
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { cat: cat === 'all' ? null : cat },
      queryParamsHandling: 'merge'
    });
  }

  labelOf(id: Category): string {
    return this.categories.find(c => c.id === id)?.label ?? id;
  }

  get counts(): Record<'all' | Category, number> {
    const acc: Record<any, number> = { all: this.products.length };
    for (const c of this.categories) acc[c.id] = 0;
    for (const p of this.products) acc[p.category] = (acc[p.category] || 0) + 1;
    return acc as Record<'all' | Category, number>;
  }

  get shown(): Product[] {
    return this.selectedCat === 'all'
      ? this.products
      : this.products.filter(p => p.category === this.selectedCat);
  }

  add(p: Product) { this.cart.add(p); }
}
