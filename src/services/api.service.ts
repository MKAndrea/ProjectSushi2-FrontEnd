import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cibo } from '../modules/product';
import { Bevanda } from '../modules/bevanda';
import { Dolce } from '../modules/dolci';
import { orderDTO } from '../modules/orderDTO';
import { orderDetailsDTO } from '../modules/orderDetailsDTO';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private urls = {
    urlGetProduct: "http://localhost:8080/product",
    urlUpdateCart: "http://localhost:8080/Orders/cart",
    urlGetCart: "http://localhost:8080/Orders/"
  }

  constructor(private http: HttpClient) { }

  getProva(): Observable<any[]>{
    return this.http.get<any[]>(this.urls.urlGetProduct);
  }

  getProvaPost(url:string, body: orderDetailsDTO): Observable<orderDetailsDTO[]>{
    return this.http.post<orderDetailsDTO[]>(url, body)
  }

  getProdotto(url: string): Observable<Cibo[]>{
    return this.http.get<Cibo[]>(`${url}`)
  }

  getProductCibo(): Observable<Cibo[]>{
    return this.http.get<Cibo[]>(this.urls.urlGetProduct);
  }

  sendProductCart(data: orderDTO): Observable<orderDTO>{
    return this.http.post<orderDTO>(this.urls.urlUpdateCart, data);
  }

  updateProductCart(id: number, data: orderDTO): Observable<orderDTO>{
    return this.http.put<orderDTO>(`${this.urls.urlUpdateCart}/${id}`,data)
  }

  addProduct(data: Cibo){
    return this.http.post<Cibo>(this.urls.urlGetProduct, data)
  }

  updateProductById(url: string, id: number, data: Cibo): Observable<Cibo>{
    return this.http.put<Cibo>(`${url}/${id}`, data);
  }

  deleteProductById(url: string): Observable<Cibo>{
    return this.http.delete<Cibo>(url);
  }
}
