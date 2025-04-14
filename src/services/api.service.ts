import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Prodotto } from '../modules/product';
import { orderDTO } from '../modules/orderDTO';
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

  getProduct(): Observable<Prodotto[]>{
    return this.mainApiService.generalGet(this.endpoint.PRODUCT)
  }

  getProductCiboo(): Observable<Prodotto[]>{
    return this.mainApiService.generalGet(this.endpoint.PRODUCT + this.endpoint.CIBO)
  }

  getProductBevandee(): Observable<Prodotto[]>{
    return this.mainApiService.generalGet(this.endpoint.PRODUCT + this.endpoint.BEVANDE)
  }

  getProductDolcii(): Observable<Prodotto[]>{
    return this.mainApiService.generalGet(this.endpoint.PRODUCT + this.endpoint.DOLCI)
  }

  getProductCartt(): Observable<orderDTO[]>{
    return this.mainApiService.generalGet(this.endpoint.ORDERS)
  }

  sendProductCartt(body: orderDTO): Observable<orderDTO>{
    const finalEndpoint = this.endpoint.ORDERS + this.endpoint.CART
    return this.mainApiService.generalPost(this.endpoint.ORDERS_CART, body)
  }

  updateProductCartt(id: number, body: orderDTO): Observable<orderDTO>{
    const finalEndpoint = this.endpoint.ORDERS + this.endpoint.CART
    return this.mainApiService.generalPut(`${finalEndpoint}/${id}`, body)
  }

  addProductt(body: Prodotto): Observable<Prodotto>{
    return this.mainApiService.generalPost(this.endpoint.PRODUCT, body)
  }
  updateProducttById(id: number, body: Prodotto): Observable<Prodotto>{
    return this.mainApiService.generalPut(`${this.endpoint.PRODUCT}/${id}`, body);
  }

  deleteProducttById(id: number): Observable<Prodotto>{
    return this.mainApiService.generalDelete(`${this.endpoint.PRODUCT}/${id}`)
  }

//   getProva(): Observable<any[]>{
//     return this.http.get<any[]>(this.urls.urlGetProduct);
//   }

//   getProvaPost(url:string, body: OrderDetails): Observable<OrderDetails[]>{
//     return this.http.post<OrderDetails[]>(url, body)
//   }

//   getProdotto(): Observable<Prodotto[]>{
//     return this.http.get<Prodotto[]>(`${this.urls.urlGetProduct}`)
//   }

//   getProductCibo(): Observable<Prodotto[]>{
//     return this.http.get<Prodotto[]>(this.urls.urlGetProductCibo);
//   }

//   getProductBevande(): Observable<Prodotto[]>{
//     return this.http.get<Prodotto[]>(this.urls.urlGetProductBevande);
//   }

//   getProductDolci(): Observable<Prodotto[]>{
//     return this.http.get<Prodotto[]>(this.urls.urlGetProductDolci);
//   }

//   getProductCart(): Observable<orderDTO[]>{
//     return this.http.get<orderDTO[]>(this.urls.urlGetProductCart);
//   }

//   sendProductCart(data: orderDTO): Observable<orderDTO>{
//     return this.http.post<orderDTO>(this.urls.urlUpdateCart, data);
//   }

//   updateProductCart(id: number, data: orderDTO): Observable<orderDTO>{
//     return this.http.put<orderDTO>(`${this.urls.urlUpdateCart}/${id}`,data)
//   }

//   addProduct(data: Prodotto){
//     return this.http.post<Prodotto>(this.urls.urlGetProduct, data)
//   }

//   updateProductById(url: string, id: number, data: Prodotto): Observable<Prodotto>{
//     return this.http.put<Prodotto>(`${url}/${id}`, data);
//   }

//   deleteProductById(url: string): Observable<Prodotto>{
//     return this.http.delete<Prodotto>(url);
//   }
}
