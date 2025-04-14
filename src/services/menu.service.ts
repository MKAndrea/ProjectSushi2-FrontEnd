import { Injectable } from '@angular/core';
import { Prodotto } from '../modules/product';
import { BehaviorSubject, Observable, retry, Subject } from 'rxjs';
import { Cart } from '../modules/cart';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { Endpoint } from '../app/apiCatalog/endpoint';


@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private http: HttpClient, private apiService: ApiService) { }

  ciboArray: Prodotto[] = [

  ];

  counters: number[] = Array(this.ciboArray.length).fill(0);

  carrello: BehaviorSubject<Cart> = new BehaviorSubject<Cart>({cart: []})

  generalCounter: number = 0;

  endpoint = Endpoint;

  getCarrelloAsObservable(): Observable<Cart> {
    return this.carrello.asObservable();
  }

  getCiboArray(): Prodotto[]{
    return this.ciboArray;
  }

  sendOrder(prezzoTotale: number): void{
    let carTemp = this.carrello.getValue();
    if(confirm(`Stai per inviare l'ordine sei sicuro?\nIl prezzo totale è di ${prezzoTotale}$`)){
      alert("Ordine inviato!")
      carTemp.cart.forEach(element => {
        element.quantity = 0;
        carTemp.cart = [];
      });
    }
    this.carrello.next(carTemp);
  }

  resetCarrello(): void {
    const nuovoCarrello: Cart = { cart: []};
    this.carrello.next(nuovoCarrello);
  }

  incrementCounter(ciboDaAggiungere: Prodotto): void {
    let cartTemp = this.carrello.getValue();
    const index = cartTemp.cart.findIndex(cibo => cibo.name == ciboDaAggiungere.name)
    if(index != -1){
      cartTemp.cart[index].quantity! += 1
    } else {
      ciboDaAggiungere.quantity = 1;
      cartTemp.cart.push(ciboDaAggiungere)
    }
    this.carrello.next(cartTemp)
  }

  decrementCounter(ciboDaRimuovere: Prodotto): void{
    let cartTemp = this.carrello.getValue();
    const index = cartTemp.cart.findIndex(cibo => cibo.name == ciboDaRimuovere.name)
    if(index != -1 && cartTemp.cart[index].quantity! > 1){
      cartTemp.cart[index].quantity! -= 1
    } else if (index != -1) {
      cartTemp.cart = cartTemp.cart.filter(cibo => cibo.name != ciboDaRimuovere.name)
    }
    this.carrello.next(cartTemp)
  }

  removeCibo(ciboDaRimuovere: Prodotto): void{
    let cartTemp = this.carrello.getValue();
    const index = cartTemp.cart.findIndex(cibo => cibo.name == ciboDaRimuovere.name)
    if (index != -1) {
      cartTemp.cart = cartTemp.cart.filter(cibo => cibo.name != ciboDaRimuovere.name)
      this.carrello.next(cartTemp)
    }
  }

}
