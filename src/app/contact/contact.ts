// src/app/contact/contact.ts
import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-contact',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css']
})
export class ContactComponent {
  private fb = inject(FormBuilder); // ✅ disponible avant l’utilisation

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    message: ['', Validators.required]
  });

  sent = signal(false);

  submit() {
    if (this.form.invalid) return;
    console.log('Contact payload', this.form.value);
    this.sent.set(true);
    this.form.reset();
  }
}
