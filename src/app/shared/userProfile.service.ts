import { Injectable, inject, computed } from '@angular/core';

import {
  Firestore, doc, docData, setDoc, getDoc, updateDoc, serverTimestamp
} from '@angular/fire/firestore';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap, of } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { UserPreferences, UserProfile } from '../userProfile.model';

@Injectable({ providedIn: 'root' })
export class UserProfileService {
  private fs = inject(Firestore);
  private auth = inject(AuthService);

  // Flux Firestore du doc /users/{uid}
  private profile$ = this.auth.user$.pipe(
    switchMap(u => u ? docData(doc(this.fs, 'users', u.uid)) as any : of(null)),
    map(p => p as UserProfile | null)
  );

  profile = toSignal(this.profile$, { initialValue: null });

  // True si connecté ET doc profil chargé
  hasProfile = computed(() => !!this.profile());

  // Création si manquant (à appeler au login)
  async ensureForCurrentUser() {
    const u = this.auth.user();
    if (!u) return;

    const ref = doc(this.fs, 'users', u.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        uid: u.uid,
        email: u.email ?? null,
        displayName: u.displayName ?? null,
        photoURL: u.photoURL ?? null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        prefs: { regionId: 'FR', taxRate: 0.20, favoriteCategories: [], newsletter: false }
      } satisfies UserProfile);
    }
  }

  async updateProfile(partial: Partial<UserProfile>) {
    const u = this.auth.user();
    if (!u) throw new Error('Not authenticated');
    const ref = doc(this.fs, 'users', u.uid);
    await updateDoc(ref, { ...partial, updatedAt: serverTimestamp() });
  }

  async savePreferences(prefs: Partial<UserPreferences>) {
    const u = this.auth.user();
    if (!u) throw new Error('Not authenticated');
    const ref = doc(this.fs, 'users', u.uid);
    await updateDoc(ref, { 'prefs': prefs, updatedAt: serverTimestamp() });
  }
}
