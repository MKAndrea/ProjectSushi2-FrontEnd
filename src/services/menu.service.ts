import { Injectable } from '@angular/core';
import { Prodotto } from '../modules/product';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart } from '../modules/cart';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { Endpoint } from '../app/apiCatalog/endpoint';
import { OrderDetails } from '../modules/orderDetails';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private http: HttpClient, private apiService: ApiService) { }

  // Dati statici
  ciboArray: Prodotto[] = [];

  counters: number[] = Array(this.ciboArray.length).fill(0);

  // Carrello con OrderDetails
  carrello: BehaviorSubject<Cart> = new BehaviorSubject<Cart>({ cart: [] });

  generalCounter: number = 0;

  endpoint = Endpoint;

  // Restituisce un observable del carrello
  getCarrelloAsObservable(): Observable<Cart> {
    return this.carrello.asObservable();
  }

  // Ritorna un array di tipo "Prodotto"
  getCiboArray(): Prodotto[] {
    return this.ciboArray;
  }

  // Azzera il carrello
  resetCart(): void {
    const nuovoCarrello: Cart = { cart: [] };
    this.carrello.next(nuovoCarrello);
  }

  // Aggiunge prodotti al carrello o incrementa la quantità se già presente
  incrementCounter(prodotto: Prodotto): void {
    const cartTemp = this.carrello.getValue();
    const index = cartTemp.cart.findIndex(item => item.product.id === prodotto.id);

    if (index !== -1) {
      cartTemp.cart[index].quantity += 1;
    } else {
      cartTemp.cart.push({
        product: prodotto,
        quantity: 1
      });
    }

    this.carrello.next(cartTemp);
  }

  // Rimuove quantità o elimina se quantità arriva a 0
  decrementCounter(prodotto: Prodotto): void {
    const cartTemp = this.carrello.getValue();
    const index = cartTemp.cart.findIndex(item => item.product.id === prodotto.id);

    if (index !== -1) {
      if (cartTemp.cart[index].quantity > 1) {
        cartTemp.cart[index].quantity -= 1;
      } else {
        cartTemp.cart.splice(index, 1);
      }
      this.carrello.next(cartTemp);
    }
  }

  // Rimuove completamente il prodotto dal carrello
  removeCibo(orderDetail: OrderDetails): void {
    const cartTemp = this.carrello.getValue();
    cartTemp.cart = cartTemp.cart.filter(item => item.product.id !== orderDetail.product.id);
    this.carrello.next(cartTemp);
  }

  // Facoltativo: invio ordine fittizio (esempio)
  sendOrder(prezzoTotale: number): void {
    const carTemp = this.carrello.getValue();
    if (confirm(`Stai per inviare l'ordine sei sicuro?\nIl prezzo totale è di ${prezzoTotale}€`)) {
      alert("Ordine inviato!");
      carTemp.cart = [];
      this.carrello.next(carTemp);
    }
  }

  //Aggiorna il valore del carrello
  setCart(nuovoCarrello: Cart): void {
    this.carrello.next(nuovoCarrello); 
  }
}
