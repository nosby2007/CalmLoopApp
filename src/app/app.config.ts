// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

// ✅ Firebase
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

// ⚙️ Ton fichier d’environnement
import { environment } from '../environments/environment'; // ajuste le chemin si besoin

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    // 👇 IMPORTANT : initialise l’app Firebase
    provideFirebaseApp(() => initializeApp(environment.firebase)),

    // Auth & Firestore
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
};
