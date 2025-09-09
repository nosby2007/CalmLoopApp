import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CATEGORIES, Product, PRODUCTS } from './products';


@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  getProducts(): Observable<Product[]> {
    return of(PRODUCTS);
  }

  getProductCategories(): Observable<any[]> {
    return of(CATEGORIES);
  }
}