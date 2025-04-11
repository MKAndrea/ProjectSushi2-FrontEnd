import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cibo } from '../app/ProductDTO';
import { Prodotti } from '../app/prodotti';
import { Bevanda } from '../app/bevanda';
import { Dolce } from '../app/dolci';
import { orderDTO } from '../orderDTO';
import { orderDetailsDTO } from '../orderDetailsDTO';
import { CiboDTO } from '../ciboDTO';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private url = "http://localhost:8080/product";

  constructor(private http: HttpClient) { }

  getProva(): Observable<any[]>{
    return this.http.get<any[]>(this.url);
  }

  getProvaPost(url:string, body: orderDetailsDTO): Observable<orderDetailsDTO[]>{
    return this.http.post<orderDetailsDTO[]>(url, body)
  }

  getProdotto(url: string): Observable<Cibo[]>{
    return this.http.get<Cibo[]>(`${url}`)
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

  sendProductCart(url:string, data: orderDTO): Observable<orderDTO>{
    return this.http.post<orderDTO>(url, data);
  }

  updateProductCart(id: number, data: orderDTO): Observable<orderDTO>{
    return this.http.put<orderDTO>(`http://localhost:8080/Orders/cart/${id}`,data)
  }

  addProduct(data: Cibo){
    return this.http.post<Cibo>(this.url, data)
  }

  updateProductById(url: string, id: number, data: Cibo): Observable<Cibo>{
    return this.http.put<Cibo>(`${url}/${id}`, data);
  }

  deleteProductById(url: string): Observable<Cibo>{
    return this.http.delete<Cibo>(url);
  }
}
