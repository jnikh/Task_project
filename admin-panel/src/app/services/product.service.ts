import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductCreatePayload, ProductUpdatePayload, DeleteProductResponse } from '../product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
 private apiUrl = 'http://localhost:3000/products'
  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  // Get a single product by ID
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }   

  // Add a new product
  createProduct(product: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}`, product);
  }
  

  // Update a product
  updateProduct(productId: number, payload: any): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${productId}`, payload);
  }
  

  // Delete a product
  deleteProduct(productId: number): Observable<DeleteProductResponse> {
    return this.http.delete<DeleteProductResponse>(`${this.apiUrl}/${productId}`);
  }
}
