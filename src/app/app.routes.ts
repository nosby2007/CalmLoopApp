// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home').then(m => m.HomeComponent),
    title: 'Accueil'
  },
  {
    path: 'apropos',
    loadComponent: () => import('./about/about').then(m => m.AboutComponent),
    title: 'À propos'
  },
  {
    path: 'boutique',
    loadComponent: () => import('./shop/shop').then(m => m.ShopComponent),
    title: 'Boutique'
  },
  {
    path: 'contact',
    loadComponent: () => import('./contact/contact').then(m => m.ContactComponent),
    title: 'Nous contacter'
  },
  { path: '**', redirectTo: '' }
];
