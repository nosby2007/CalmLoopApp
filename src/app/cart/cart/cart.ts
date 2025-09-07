// src/app/cart/cart.ts
import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { CartService } from '../../shared/cart.service';
import { AuthService } from '../../auth/auth.service';
import { UserProfileService } from '../../shared/userProfile.service';


type RegionRate = { id: string; label: string; rate: number };

@Component({
  standalone: true,
  selector: 'app-cart',
  imports: [CommonModule, RouterLink, CurrencyPipe, NgFor, NgIf],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class CartComponent {
  private profiles = inject(UserProfileService);
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
    // si le profil est chargé et contient une région, applique-la
  effect(() => {
    const p = this.profiles.profile();
    if (!p?.prefs?.regionId) return;
    const r = this.regions.find(x => x.id === p.prefs!.regionId);
    if (!r) return;
    this.region.set(r);
    this.cart.setTaxRate(r.rate);
  });
  }

  chooseRegion(id: string) {
    const r = this.regions.find(x => x.id === id) ?? this.regions[0];
    this.region.set(r);
    this.cart.setTaxRate(r.rate);
     // ✅ Sauvegarde dans le profil si connecté
     try { this.profiles.savePreferences({ regionId: r.id, taxRate: r.rate }); } catch {}
    
  }
  

    // 👇 AJOUT
    private auth = inject(AuthService);
    user = this.auth.user; // signal<User|null>
  
    // Nom à afficher : displayName -> sinon email local-part -> sinon "cher parent"
    greetName = computed(() => {
      const u = this.user();
      const raw =
        (u?.displayName && u.displayName.trim()) ||
        (u?.email ? u.email.split('@')[0] : '') ||
        'cher parent';
      // Première lettre en majuscule
      return raw.charAt(0).toUpperCase() + raw.slice(1);
    });

  inc(id: number) { this.cart.inc(id); }
  dec(id: number) { this.cart.dec(id); }
  set(id: number, v: string) { this.cart.setQty(id, Number(v)); }
  remove(id: number) { this.cart.remove(id); }
  clear() { this.cart.clear(); }
  goToShop() { this.router.navigate(['/boutique']); }

  pay() { this.router.navigate(['/checkout']); }
}
