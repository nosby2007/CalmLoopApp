import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-about',
  imports: [CommonModule],
  styles: [`
    .card { background:#f8fafc; border:1px solid #e2e8f0; border-radius:16px; padding:20px; }
    h2 { margin-top:0 }
  `],
  template: `
    <div class="card">
      <h2>À propos</h2>
      <p>Cette application illustre la structure <b>Angular Standalone</b> : pas de NgModule,
      routing via <code>provideRouter</code>, composants lazy via <code>loadComponent</code>,
      services <code>providedIn: 'root'</code> et state minimal avec <code>signal()</code>.</p>
    </div>
  `
})
export class AboutComponent {}
