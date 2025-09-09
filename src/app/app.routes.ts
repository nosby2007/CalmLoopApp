// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './auth/auth-guard';
import { Admin } from './Admin/admin/admin';


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
  
  // 🧺 Panier
  { path: 'panier',   loadComponent: () => import('./cart/cart/cart').then(m => m.CartComponent),       title: 'Votre panier' },

  // 💳 Checkout (stub)
  { path: 'checkout', canActivate: [authGuard], loadComponent: () => import('./checkout/checkout/checkout').then(m => m.CheckoutComponent), title: 'Paiement' },
  {
    path: 'contact',
    loadComponent: () => import('./contact/contact').then(m => m.ContactComponent),
    title: 'Nous contacter'
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login').then(m => m.LoginComponent),
    title: 'Login'
  },
  {
    path: 'register',
    loadComponent: () => import('./registration/registration').then(m => m.RegisterComponent),
    title: 'Register'
  },
  { path: 'profil', canActivate: [authGuard],
    loadComponent: () => import('./profile/profile/profile').then(m => m.ProfileComponent),
    title: 'Mon profil'
  },
  { path: 'admin', loadComponent: () => import('./Admin/admin/admin').then(m => m.Admin), title: 'Admin' },
  
  { path: '**', redirectTo: '' }
];