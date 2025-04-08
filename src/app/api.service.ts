import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cibo } from './cibo';
import { Prodotti } from './prodotti';
import { Bevanda } from './bevanda';
import { Dolce } from './dolci';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private url = "http://localhost:8080/product";

  constructor(private http: HttpClient) { }

  getProva(): Observable<any[]>{
    return this.http.get<any[]>(this.url);
  }

  getProductCibo(): Observable<Cibo[]>{
    return this.http.get<Cibo[]>(this.url);
  }
  getProductBevande(): Observable<Bevanda[]>{
    return this.http.get<Bevanda[]>(this.url);
  }
  getProductDolci(): Observable<Dolce[]>{
    return this.http.get<Dolce[]>(this.url);
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
