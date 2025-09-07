// src/app/profile/profile.ts
import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, NonNullableFormBuilder } from '@angular/forms'; // ⬅️
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { CATEGORIES, Category } from '../../shared/products';
import { UserProfileService } from '../../shared/userProfile.service';


type RegionRate = { id: string; label: string; rate: number };

@Component({
  standalone: true,
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent {
  // ⬇️ utilise le builder non-nullable
  private fb = inject(NonNullableFormBuilder);
  profiles = inject(UserProfileService);
  auth = inject(AuthService);

  regions: RegionRate[] = [
    { id: 'FR',    label: 'France (TVA 20%)',           rate: 0.20 },
    { id: 'CA-QC', label: 'Canada — Québec (14.975%)',  rate: 0.14975 },
    { id: 'CA-ON', label: 'Canada — Ontario (13%)',     rate: 0.13 },
    { id: 'US-CA', label: 'USA — California (7.25%)',   rate: 0.0725 },
    { id: 'US-NY', label: 'USA — New York (4%)',        rate: 0.04 },
    { id: 'NONE',  label: 'Hors taxe (0%)',             rate: 0 }
  ];
  categories = CATEGORIES;

  saving = signal(false);
  saved  = signal(false);

  // ✅ contrôles non-nullables, donc plus de `| null`
  form = this.fb.group({
    displayName: this.fb.control<string>(''),
    regionId: this.fb.control<string>('FR'),
    taxRate: this.fb.control<number>(0.20),
    favoriteCategories: this.fb.control<Category[]>([]),
    newsletter: this.fb.control<boolean>(false)
  });

  constructor() {
    // hydrate depuis Firestore
    effect(() => {
      const p = this.profiles.profile();
      if (!p) return;
      this.form.patchValue({
        displayName: p.displayName ?? '',
        regionId:    p.prefs?.regionId ?? 'FR',
        taxRate:     p.prefs?.taxRate ?? 0.20,
        favoriteCategories: p.prefs?.favoriteCategories ?? [],
        newsletter:  !!p.prefs?.newsletter
      }, { emitEvent: false });
    });

    // sync taux lorsqu’on change la région
    this.form.controls.regionId.valueChanges.subscribe(id => {
      const r = this.regions.find(x => x.id === id) ?? this.regions[0];
      this.form.controls.taxRate.setValue(r.rate, { emitEvent: false });
    });
  }

  toggleCategory(cat: Category) {
    const current = new Set(this.form.controls.favoriteCategories.value);
    current.has(cat) ? current.delete(cat) : current.add(cat);
    this.form.controls.favoriteCategories.setValue(Array.from(current));
  }

  async save() {
    this.saving.set(true); this.saved.set(false);
    try {
      const v = this.form.getRawValue();
      await this.profiles.updateProfile({ displayName: v.displayName || null });
      await this.profiles.savePreferences({
        regionId: v.regionId,
        taxRate:  v.taxRate,
        favoriteCategories: v.favoriteCategories,
        newsletter: v.newsletter
      });
      this.saved.set(true);
      setTimeout(() => this.saved.set(false), 1500);
    } finally {
      this.saving.set(false);
    }
  }
}
