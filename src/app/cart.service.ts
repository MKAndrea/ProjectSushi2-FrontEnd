import { Injectable } from '@angular/core';
import { Cibo } from './ProductDTO';
import { BehaviorSubject, Subject } from 'rxjs';
import { MenuService } from './menu.service';
import { Cart } from './cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor() { }

  private counterSubject: any;
  cartArray: Cibo[] = [];

  addCart(cibo: Cibo, id: number){
    // if(this.cartArray.findIndex(c => c.id === id)=== -1){
    //   alert("Prodotto aggiunto al carrello")
    //   this.cartArray.push(cibo);
    // }
    // else{
    //   alert("Prodotto già aggiunto al carrello!")
    // }
  }

  removeCart(id: number){
    // if(confirm("Sei sicuro di voler rimuovere questo prodotto?")){
    //   this.cartArray = this.cartArray.filter(c => c.id != id)
    //   alert("Prodotto rimosso")
    // }
  }

  /*sendOrder(carrello: Cart){
    alert("Ordine Inviato");
    carrello.cart.forEach((elemento, indice) => elemento.quantity)
    //this.ca.splice(0, this.cartArray.length);
    console.log(this.cartArray);
  }*/

  getCart(){
    return this.cartArray;
  }
}
