import { inject, Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { Auth, createUserWithEmailAndPassword, UserCredential } from '@angular/fire/auth';

@Injectable()
export class RegistrationService {
  private auth = inject(Auth);

  public register(email: string, password: string): Observable<UserCredential> {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }
}
