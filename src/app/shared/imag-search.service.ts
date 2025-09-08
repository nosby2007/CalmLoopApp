// src/app/shared/image-search.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SearchHit {
  id: string;
  score: number;
  productId: string;
  name: string;
  price: number;
  image: string;
  categories: string[];
}
export interface SearchResponse { hits: SearchHit[]; }

@Injectable({ providedIn: 'root' })
export class ImageSearchService {
  private http = inject(HttpClient);
  private api = 'https://<ton-service>/search-by-image'; // TODO: remplace par ton endpoint

  search(file: File, category?: string): Observable<SearchResponse> {
    const form = new FormData();
    form.append('file', file);
    const params: Record<string,string> = {};
    if (category) params['category'] = category;
    return this.http.post<SearchResponse>(this.api, form, { params });
  }
}
