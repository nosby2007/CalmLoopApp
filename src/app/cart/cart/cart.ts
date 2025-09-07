// src/app/cart/cart.ts
import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { CartService } from '../../shared/cart.service';


type RegionRate = { id: string; label: string; rate: number };

@Component({
  standalone: true,
  selector: 'app-cart',
  imports: [CommonModule, RouterLink, CurrencyPipe, NgFor, NgIf],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class CartComponent {
  cart = inject(CartService);
  router = inject(Router);

  // 👇 Zones exemple (adapte selon ton marché)
  regions: RegionRate[] = [
    { id: 'FR',    label: 'France (TVA 20%)',           rate: 0.20 },
    { id: 'CA-QC', label: 'Canada — Québec (14.975%)',  rate: 0.14975 },
    { id: 'CA-ON', label: 'Canada — Ontario (13%)',     rate: 0.13 },
    { id: 'US-CA', label: 'USA — California (7.25%)',   rate: 0.0725 },
    { id: 'US-NY', label: 'USA — New York (4%)',        rate: 0.04 },
    { id: 'NONE',  label: 'Hors taxe (0%)',             rate: 0 }
  ];

  region = signal<RegionRate>(this.regions[0]); // défaut: France
  items   = computed(() => this.cart.items());
  count   = computed(() => this.cart.count());
  subtotal= computed(() => this.cart.subtotal());
  taxRate = computed(() => this.region().rate);
  tax     = computed(() => this.cart.tax());
  total   = computed(() => this.cart.total());

  constructor() {
    // initialise le taux
    this.cart.setTaxRate(this.taxRate());
  }

  chooseRegion(id: string) {
    const r = this.regions.find(x => x.id === id) ?? this.regions[0];
    this.region.set(r);
    this.cart.setTaxRate(r.rate);
  }

  inc(id: number) { this.cart.inc(id); }
  dec(id: number) { this.cart.dec(id); }
  set(id: number, v: string) { this.cart.setQty(id, Number(v)); }
  remove(id: number) { this.cart.remove(id); }
  clear() { this.cart.clear(); }
  goToShop() { this.router.navigate(['/boutique']); }

  pay() { this.router.navigate(['/checkout']); }
}
