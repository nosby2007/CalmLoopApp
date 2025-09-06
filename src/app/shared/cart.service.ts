import { Injectable, signal } from '@angular/core';
import { Product } from './products';


export type CartItem = { product: Product; qty: number };

@Injectable({ providedIn: 'root' })
export class CartService {
  private _items = signal<CartItem[]>([]);
  items = this._items.asReadonly();

  add(p: Product) {
    const list = [...this._items()];
    const found = list.find(i => i.product.id === p.id);
    if (found) found.qty += 1; else list.push({ product: p, qty: 1 });
    this._items.set(list);
  }

  remove(id: number) {
    this._items.set(this._items().filter(i => i.product.id !== id));
  }

  clear() { this._items.set([]); }

  total() {
    return this._items().reduce((s, i) => s + i.product.price * i.qty, 0);
  }
}
