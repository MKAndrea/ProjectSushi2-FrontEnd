import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { CartService } from '../cart.service';
import { Cibo } from '../cibo';
import { MenuService } from '../menu.service';
import { CardCartComponent } from "../card-cart/card-cart.component";
import { Cart } from '../cart';
import { Bevanda } from '../bevanda';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-cart',
  imports: [HeaderComponent, FooterComponent, CardCartComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit{

  constructor(private cartService: CartService, private menuService: MenuService, private apiService: ApiService){

  }
  counters: number[] = [];

  private counterSubscription: any;
  carrello: Cart = {cart: [], prodotti: []};
  ngOnInit(): void {
    this.menuService.getCarrelloAsObservable().subscribe(value => {
      this.carrello.cart = value.cart;
    })
  }

  incrementCounter(cibo: Cibo){
    this.menuService.incrementCounter(cibo);
    //this.counters[id]++;
  }

  decrementCounter(cibo: Cibo){
    this.menuService.decrementCounter(cibo);
  }

  /*sendOrder(){
    if(this.menuService.generalCounter != 0){
      this.cartService.sendOrder(this.carrello)
      // this.menuService.resetCountersGeneral();
    }
    else{
      alert("Non hai prodotti nel carrello!");
    }
  }*/
  sendOrder(){
    // this.apiService.getProvaPost(this.carrello).subscribe(risposta => {
    //   console.log("Ordine inviato con successo", risposta);
    // })
    this.menuService.sendOrder();
  }

   removeCibo(cibo: Cibo){
    this.menuService.removeCibo(cibo);
   }

  
}
