import { Injectable, inject, computed } from '@angular/core';
import {
  Auth, authState, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut, updateProfile, setPersistence, browserLocalPersistence,
  GoogleAuthProvider, signInWithPopup, User
} from '@angular/fire/auth';
import { from } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);

  // flux + signal utilisateur
  user$ = authState(this.auth);
  user = toSignal(this.user$, { initialValue: null as User | null });
  isLoggedIn = computed(() => !!this.user());

  constructor() {
    // session persistante (onglet/fermeture)
    setPersistence(this.auth, browserLocalPersistence);
  }

  login(email: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  googleLogin() {
    const provider = new GoogleAuthProvider();
    return from(signInWithPopup(this.auth, provider));
  }

  async register(name: string, email: string, password: string) {
    const cred = await createUserWithEmailAndPassword(this.auth, email, password);
    if (name) await updateProfile(cred.user, { displayName: name });
    return cred;
  }

  logout() {
    return from(signOut(this.auth));
  }
}
