// src/app/shared/cart.service.ts
import { Injectable, signal } from '@angular/core';
import { Product } from './products';


export type CartItem = { product: Product; qty: number };

@Injectable({ providedIn: 'root' })
export class CartService {
  private _items = signal<CartItem[]>([]);
  items = this._items.asReadonly();

  // 👇 AJOUT
  private _taxRate = signal(0);            // ex. 0.20 = 20%
  taxRate = this._taxRate.asReadonly();

  add(p: Product) {
    const list = [...this._items()];
    const found = list.find(i => i.product.id === p.id);
    found ? (found.qty += 1) : list.push({ product: p, qty: 1 });
    this._items.set(list);
  }

  remove(id: number) { this._items.set(this._items().filter(i => i.product.id !== id)); }
  inc(id: number) { this._items.set(this._items().map(i => i.product.id === id ? { ...i, qty: i.qty + 1 } : i)); }
  dec(id: number) { this._items.set(this._items().map(i => i.product.id === id ? { ...i, qty: Math.max(1, i.qty - 1) } : i)); }
  setQty(id: number, qty: number) {
    const q = Math.max(1, Math.floor(qty || 1));
    this._items.set(this._items().map(i => i.product.id === id ? { ...i, qty: q } : i));
  }

  clear() { this._items.set([]); }

  count(): number { return this._items().reduce((sum: number, it: CartItem) => sum + it.qty, 0); }
  subtotal(): number { return this._items().reduce((sum: number, it: CartItem) => sum + it.product.price * it.qty, 0); }

  // 👇 AJOUT
  setTaxRate(rate: number) { this._taxRate.set(Math.max(0, rate || 0)); }
  tax(): number { return this.subtotal() * this._taxRate(); }
  total(): number { return this.subtotal() + this.tax(); } // + shipping/taxes additionnelles si besoin
}
