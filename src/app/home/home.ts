// src/app/home/home.ts
import { Component, inject, OnInit, OnDestroy, ElementRef , ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../shared/cart.service';
import { Product, PRODUCTS, CATEGORIES, Category } from '../shared/products';
import { NgIf, NgFor } from '@angular/common'; // si tu utilises explicitement



@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, RouterLink, CurrencyPipe],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {
  @ViewChild('rail', { static: true }) rail!: ElementRef<HTMLDivElement>;

  // Produits en avant
  newReleases: Product[] = [
    { id: 101, name: 'Liniment Bio 500ml', description: 'Soin doux pour le change.', price: 9.9,
      image: 'https://res.cloudinary.com/dtdpx59sc/image/upload/v1757347571/IMG_2972_fvwrze.jpg', category: 'soins-bebe' } as any,
    { id: 102, name: 'Coton tout doux (80)', description: 'Ultra-doux pour la toilette.', price: 3.5,
      image: 'https://res.cloudinary.com/dtdpx59sc/image/upload/v1757347058/IMG_2968_gpodaw.jpg', category: 'soins-bebe' } as any,
    { id: 103, name: 'Thermomètre digital', description: 'Rapide et confortable.', price: 14.9,
      image: 'https://res.cloudinary.com/dtdpx59sc/image/upload/v1757347214/c2577111-eda2-40f8-8ea3-8eed79455e86_fr33f1.jpg', category: 'puericulture' } as any,
    { id: 104, name: 'Tissus en coton', description: 'Lot 3 – respirants.', price: 12.0,
      image: 'https://res.cloudinary.com/dtdpx59sc/image/upload/v1757380613/Screenshot_2025-09-08_211631_tq7utd.png', category: 'textile' } as any,
  ];
  private cart = inject(CartService);

  products: Product[] = PRODUCTS;
  categories = CATEGORIES;
  selectedCat: 'all' | Category = 'all';

  get shown(): Product[] {
    return this.selectedCat === 'all'
      ? this.products
      : this.products.filter(p => p.category === this.selectedCat);
  }

  labelOf(id: Category): string {
    return this.categories.find(c => c.id === id)?.label ?? id;
  }

  currentIndex = 0;
  private intervalId: any;

  ngOnInit() {
    this.startAutoSlide();
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  startAutoSlide() {
    this.intervalId = setInterval(() => this.next(), 5000); // défile toutes les 5s
  }

  prev1() {
    this.currentIndex =
      (this.currentIndex - 1 + this.newReleases.length) % this.newReleases.length;
  }

  next1() {
    this.currentIndex = (this.currentIndex + 1) % this.newReleases.length;
  }
  
  add(p: Product) { this.cart.add(p); }

  private cardStep(): number {
    const first = this.rail.nativeElement.querySelector('.pcard') as HTMLElement | null;
    return first ? first.offsetWidth + 12 : this.rail.nativeElement.clientWidth * 0.9;
  }

  prev() {
    this.rail.nativeElement.scrollBy({ left: -this.cardStep(), behavior: 'smooth' });
  }
  next() {
    this.rail.nativeElement.scrollBy({ left: this.cardStep(), behavior: 'smooth' });
  }

}