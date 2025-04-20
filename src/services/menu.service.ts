import { Injectable } from '@angular/core';
import { Prodotto } from '../modules/product';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { Endpoint } from '../app/apiCatalog/endpoint';
import { OrderDetails } from '../modules/orderDetails';
import { Order } from '../modules/order';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private http: HttpClient, private apiService: ApiService) { }

  // Dati statici
  ciboArray: Prodotto[] = [];

  counters: number[] = Array(this.ciboArray.length).fill(0);

  // private isEditingSubject = new BehaviorSubject<boolean>(false);
  // public isEditing$ = this.isEditingSubject.asObservable();

  private isEdit = false;

  private isLogged = false;

  private isAdmin = new BehaviorSubject<boolean>(false);
  public isAdmin$ = this.isAdmin.asObservable();

  // Carrello con OrderDetails
  carrello: BehaviorSubject<Order> = new BehaviorSubject<Order>({ orderDetails: [] });

  generalCounter: number = 0;

  endpoint = Endpoint;

      // Funzione per settare isEditing
      setIsAdmin(value: boolean): void {
        this.isAdmin.next(value);
      }
    
      // Funzione per ottenere il valore corrente di isEditing
      getIsAdmin(): boolean {
        return this.isAdmin.value;
      }

      setIsEdit(value: boolean): void{
        this.isEdit = value;
      }

      getIsEdit(): boolean{
        return this.isEdit;
      }

    // Funzione per settare isEditing
    // setIsEditing(value: boolean): void {
    //   this.isEditingSubject.next(value);
    // }
  
    // // Funzione per ottenere il valore corrente di isEditing
    // getIsEditing(): boolean {
    //   return this.isEditingSubject.value;
    // }

    getIslogged(): boolean{
      return this.isLogged;
    }

    setIslogged(value: boolean): void{
      this.isLogged = value
    }

  // Restituisce un observable del carrello
  getCarrelloAsObservable(): Observable<Order> {
    return this.carrello.asObservable();
  }

  // Ritorna un array di tipo "Prodotto"
  getCiboArray(): Prodotto[] {
    return this.ciboArray;
  }

  // Azzera il carrello
  resetCart(): void {
    const nuovoCarrello: Order = { orderDetails: [] };
    this.carrello.next(nuovoCarrello);
  }

  // Aggiunge prodotti al carrello o incrementa la quantità se già presente
  incrementCounter(prodotto: Prodotto): void {
    const cartTemp = this.carrello.getValue();
    const index = cartTemp.orderDetails.findIndex(item => item.product.id === prodotto.id);

    if (index !== -1) {
      cartTemp.orderDetails[index].quantity += 1;
    } else {
      cartTemp.orderDetails.push({
        product: prodotto,
        quantity: 1
      });
    }

    this.carrello.next(cartTemp);
  }

  // Rimuove quantità o elimina se quantità arriva a 0 (decrement originale)
  // decrementCounter(prodotto: Prodotto): void {
  //   const cartTemp = this.carrello.getValue();
  //   const index = cartTemp.orderDetails.findIndex(item => item.product.id === prodotto.id);

  //   if (index !== -1) {
  //     if (cartTemp.orderDetails[index].quantity > 1) {
  //       cartTemp.orderDetails[index].quantity -= 1;
  //     } else {
  //       cartTemp.orderDetails.splice(index, 1);
  //     }
  //     this.carrello.next(cartTemp);
  //   }
  // }

  decrementCounter(prodotto: Prodotto): void {//di prova
    const cartTemp = this.carrello.getValue();
    const index = cartTemp.orderDetails.findIndex(item => item.product.id === prodotto.id);

    if (index !== -1) {
      if (cartTemp.orderDetails[index].quantity > 0) {
        cartTemp.orderDetails[index].quantity -= 1;
      }
      this.carrello.next(cartTemp);
    }
  }

  // Rimuove completamente il prodotto dal carrello
  removeCibo(orderDetail: OrderDetails): void {
    const cartTemp = this.carrello.getValue();
    cartTemp.orderDetails = cartTemp.orderDetails.filter(item => item.product.id !== orderDetail.product.id);
    this.carrello.next(cartTemp);
  }

  // Facoltativo: invio ordine fittizio (esempio)
  sendOrder(prezzoTotale: number): void {
    const carTemp = this.carrello.getValue();
    if (confirm(`You are about to submit the order. Are you sure? The total price is ${prezzoTotale}$.`)) {
      alert("Order sent!");
      carTemp.orderDetails = [];
      this.carrello.next(carTemp);
    }
  }

  //Aggiorna il valore del carrello
  setCart(nuovoCarrello: Order): void {
    this.carrello.next(nuovoCarrello); 
  }


}
