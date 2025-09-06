// src/app/contact/contact.ts
import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { addDoc, collection, Firestore, serverTimestamp } from 'firebase/firestore';

@Component({
  standalone: true,
  selector: 'app-contact',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css']
})
export class ContactComponent {
  private fb = inject(FormBuilder);
  private fs = inject(Firestore);

  sent = signal(false);
  error = signal<string | null>(null);

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    message: ['', Validators.required]
  });

  async submit() {
    this.error.set(null);
    if (this.form.invalid) return;

    try {
      const payload = {
        ...this.form.value,
        createdAt: serverTimestamp()
      };
      await addDoc(collection(this.fs, 'messages'), payload as any);
      this.sent.set(true);
      this.form.reset();
    } catch (e: any) {
      console.error(e);
      this.error.set('Oups, impossible d’envoyer le message. Réessaie.');
    }
  }
}
