// src/app/services/storage.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
 
@Injectable({
  providedIn: 'root'
})
export class StorageService {
 
  private isBrowser: boolean;
 
  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    // Determina se il codice sta girando nel browser
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
 
  // Metodo sicuro per salvare un elemento
  setItem(key: string, value: string): void {
    if (this.isBrowser) {
      localStorage.setItem(key, value);
    } else {
      console.warn('localStorage is not available on the server.');
      // Potresti implementare un fallback qui se necessario per SSR
    }
  }
 
  // Metodo sicuro per ottenere un elemento
  getItem(key: string): string | null {
    if (this.isBrowser) {
      return localStorage.getItem(key);
    }
    console.warn('localStorage is not available on the server.');
    return null; // O un valore di fallback
  }
 
  // Metodo sicuro per rimuovere un elemento
  removeItem(key: string): void {
    if (this.isBrowser) {
      localStorage.removeItem(key);
    } else {
      console.warn('localStorage is not available on the server.');
    }
  }
 
  // Metodo sicuro per pulire tutto
  clear(): void {
    if (this.isBrowser) {
      localStorage.clear();
    } else {
      console.warn('localStorage is not available on the server.');
    }
  }
}