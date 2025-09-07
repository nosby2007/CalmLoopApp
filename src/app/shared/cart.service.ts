import { Injectable, signal, effect, inject } from '@angular/core';
           // ou './products' selon ton projet
import { AuthService } from '../auth/auth.service';  // ajuste le chemin si besoin
import { Product } from './products';

export type CartItem = { product: Product; qty: number };
type SavedCart = { v: number; items: CartItem[]; taxRate: number };

const STORAGE_PREFIX = 'camloop_cart';
const STORAGE_VERSION = 1;

@Injectable({ providedIn: 'root' })
export class CartService {
  private auth = inject(AuthService, { optional: true });

  private _items = signal<CartItem[]>([]);
  items = this._items.asReadonly();

  private _taxRate = signal(0);
  taxRate = this._taxRate.asReadonly();

  // 🔑 clé de stockage dépendant de l’utilisateur
  private storageKey = signal<string>(this.buildKey(/* guest */));

  constructor() {
    // 1) Clé initiale + restauration
    this.loadFromStorage(this.storageKey());

    // 2) Persistance automatique à chaque changement
    effect(() => {
      const key = this.storageKey();
      const snapshot: SavedCart = {
        v: STORAGE_VERSION,
        items: this._items(),
        taxRate: this._taxRate()
      };
      try {
        localStorage.setItem(key, JSON.stringify(snapshot));
      } catch { /* quota/storage disabled — ignore */ }
    });

    // 3) Réagit aux changements d'utilisateur (guest → uid)
    if (this.auth?.user) {
      effect(() => {
        const u = this.auth!.user();            // signal<User|null>
        const prevKey = this.storageKey();
        const nextKey = this.buildKey(u?.uid);  // 'guest' ou 'uid:<...>'

        if (nextKey === prevKey) return;

        // Migration GUEST → USER (si pertinent)
        const prevState = this.read(prevKey);
        const nextState = this.read(nextKey);

        // Cas : on se connecte, on a un panier invité non-vide, et le panier user est vide → on migre
        if (prevKey.endsWith(':guest') && !nextState && prevState && prevState.items?.length) {
          try { localStorage.setItem(nextKey, JSON.stringify(prevState)); } catch {}
          // on peut aussi nettoyer l'ancien
          try { localStorage.removeItem(prevKey); } catch {}
        }

        // Bascule de clé et restauration de l'état
        this.storageKey.set(nextKey);
        this.loadFromStorage(nextKey);
      });
    }
  }

  // ---------- API panier ----------
  add(p: Product) {
    const list = [...this._items()];
    const found = list.find(i => i.product.id === p.id);
    found ? (found.qty += 1) : list.push({ product: p, qty: 1 });
    this._items.set(list);
  }

  remove(id: number) { this._items.set(this._items().filter(i => i.product.id === id)); }
  inc(id: number)    { this._items.set(this._items().map(i => i.product.id === id ? { ...i, qty: i.qty + 1 } : i)); }
  dec(id: number)    { this._items.set(this._items().map(i => i.product.id === id ? { ...i, qty: Math.max(1, i.qty - 1) } : i)); }
  setQty(id: number, qty: number) {
    const q = Math.max(1, Math.floor(qty || 1));
    this._items.set(this._items().map(i => i.product.id === id ? { ...i, qty: q } : i));
  }

  clear() { this._items.set([]); }

  count(): number {
    return this._items().reduce((sum: number, it: CartItem) => sum + it.qty, 0);
  }
  subtotal(): number {
    return this._items().reduce((sum: number, it: CartItem) => sum + it.product.price * it.qty, 0);
  }

  // ---------- Taxes ----------
  setTaxRate(rate: number) { this._taxRate.set(Math.max(0, rate || 0)); }
  tax(): number   { return this.subtotal() * this._taxRate(); }
  total(): number { return this.subtotal() + this.tax(); } // + shipping/promo si besoin

  // ---------- Storage helpers ----------
  private buildKey(uid?: string | null) {
    return `${STORAGE_PREFIX}:v${STORAGE_VERSION}:${uid ? 'uid:' + uid : 'guest'}`;
  }

  private read(key: string): SavedCart | null {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Partial<SavedCart>;
      if (parsed && typeof parsed === 'object' && Array.isArray(parsed.items)) {
        return { v: STORAGE_VERSION, items: parsed.items as CartItem[], taxRate: Number(parsed.taxRate) || 0 };
      }
    } catch { /* ignore parse errors */ }
    return null;
  }

  private loadFromStorage(key: string) {
    const data = this.read(key);
    if (data) {
      this._items.set(data.items);
      this._taxRate.set(data.taxRate ?? 0);
    } else {
      // pas de panier stocké → reset
      this._items.set([]);
      this._taxRate.set(0);
    }
  }
}
