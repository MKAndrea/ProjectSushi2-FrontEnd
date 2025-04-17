import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Prodotto } from '../modules/product';
import { Order } from '../modules/order';
import { OrderDetails } from '../modules/orderDetails';
import { url } from 'inspector';
import { Endpoint } from '../app/apiCatalog/endpoint';
import { MainApiService } from './main-api.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // private urls ={
  //   //"http://localhost:8080/"
  //   urlGetProduct: "http://localhost:8080/product",
  //   urlGetProductCibo: "http://localhost:8080/product/category/Prodotto",
  //   urlGetProductBevande: "http://localhost:8080/product/category/Bevande",
  //   urlGetProductDolci: "http://localhost:8080/product/category/Dolci",
  //   urlGetProductCart: "http://localhost:8080/Orders",
  //   urlUpdateCart: "http://localhost:8080/Orders/cart",
  //   urlGetCart: "http://localhost:8080/Orders"
  // }


  constructor(private http: HttpClient, private mainApiService: MainApiService) {
   }

  private endpoint = Endpoint;

  //ritorna tutti i prodotti del DB
  getProduct(): Observable<Prodotto[]>{
    return this.mainApiService.generalGet(this.endpoint.PRODUCT)
  }

  //ritorna tutti i prodotti che hanno la categoria "Cibo"
  getProductCibo(): Observable<Prodotto[]>{
    return this.mainApiService.generalGet(this.endpoint.PRODUCT + this.endpoint.CIBO)
  }

  //ritorna tutti i prodotti che hanno la categoria "Bevande"
  getProductBevande(): Observable<Prodotto[]>{
    return this.mainApiService.generalGet(this.endpoint.PRODUCT + this.endpoint.BEVANDE)
  }

  //ritorna tutti i prodotti che hanno la categoria "Dolci"
  getProductDolci(): Observable<Prodotto[]>{
    return this.mainApiService.generalGet(this.endpoint.PRODUCT + this.endpoint.DOLCI)
  }

  //ritorna tutti i prodotti contenuti nel carrello (quelli inviati nel carrello)
  getProductCart(): Observable<Order[]>{
    return this.mainApiService.generalGet(this.endpoint.ORDERS)
  }

  //Invia gli elementi al DB riguardo l'ordine effettuato
  sendProductCart(body: Order): Observable<Order>{
    const finalEndpoint = this.endpoint.ORDERS + this.endpoint.CART
    return this.mainApiService.generalPost(this.endpoint.ORDERS_CART, body)
  }

  //Aggiorna gli elementi già contenuti nel DB riguardo l'ordine effettuato
  updateProductCart(id: number, body: Order): Observable<Order>{
    const finalEndpoint = this.endpoint.ORDERS + this.endpoint.CART
    return this.mainApiService.generalPut(`${finalEndpoint}/${id}`, body)
  }

  //Aggiunge un prodotto al DB
  addProduct(body: Prodotto): Observable<Prodotto>{
    return this.mainApiService.generalPost(this.endpoint.ADD_PRODUCT, body)
  }

  //Aggiorna un prodotto nel DB
  updateProductById(id: number, body: Prodotto): Observable<Prodotto>{
    return this.mainApiService.generalPut(`${this.endpoint.PRODUCT}/${id}?${this.endpoint.DELETE_UPDATE}`, body);
  }

  //ELmina un prodotto nel DB
  deleteProductById(id: number): Observable<Prodotto>{
    return this.mainApiService.generalDelete(`${this.endpoint.PRODUCT}/${id}?${this.endpoint.DELETE_UPDATE}`)
  }

  deleteOrder(id: number): Observable<Order>{
    return this.mainApiService.generalDelete(`${this.endpoint.ORDERS}/${id}`)
  }
}
