import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cibo } from '../modules/product';
import { orderDTO } from '../modules/orderDTO';
import { orderDetailsDTO } from '../modules/orderDetailsDTO';
import { url } from 'inspector';
import { CiboDTO } from '../modules/ciboDTO';
import { Endpoint } from '../app/apiCatalog/endpoint';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private urls ={
    //"http://localhost:8080/"
    urlGetProduct: "http://localhost:8080/product",
    urlGetProductCibo: "http://localhost:8080/product/category/Cibo",
    urlGetProductBevande: "http://localhost:8080/product/category/Bevande",
    urlGetProductDolci: "http://localhost:8080/product/category/Dolci",
    urlGetProductCart: "http://localhost:8080/Orders",
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

  getProdotto(): Observable<Cibo[]>{
    return this.http.get<Cibo[]>(`${this.urls.urlGetProduct}`)
  }

  getProductCibo(): Observable<Cibo[]>{
    return this.http.get<Cibo[]>(this.urls.urlGetProductCibo);
  }

  getProductBevande(): Observable<Cibo[]>{
    return this.http.get<Cibo[]>(this.urls.urlGetProductBevande);
  }

  getProductDolci(): Observable<Cibo[]>{
    return this.http.get<Cibo[]>(this.urls.urlGetProductDolci);
  }

  getProductCart(): Observable<orderDTO[]>{
    return this.http.get<orderDTO[]>(this.urls.urlGetProductCart);
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
