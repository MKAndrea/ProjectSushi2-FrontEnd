import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cibo } from './cibo';
import { Prodotti } from './prodotti';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private url = "http://localhost:8080/product";

  constructor(private http: HttpClient) { }


  getProduct(): Observable<Cibo[]>{
    return this.http.get<Cibo[]>(this.url);
  }

  sendProduct(url:string, data: Cibo[]): Observable<Cibo[]>{
    return this.http.post<Cibo[]>(url, data);
  }

  updateProduct(url: string, id: number, data: Cibo): Observable<Cibo>{
    return this.http.put<Cibo>(`${url}/${id}`, data);
  }

  deleteProduct(url: string, data: Prodotti[]): Observable<Prodotti[]>{
    return this.http.delete<Prodotti[]>(url, {body: data});
  }
}
