import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { CartService } from '../cart.service';
import { Cibo } from '../cibo';
import { MenuService } from '../menu.service';
import { CardCartComponent } from "../card-cart/card-cart.component";
import { Cart } from '../cart';
import { Bevanda } from '../bevanda';
import { ApiService } from '../api.service';
import { error } from 'console';
import { orderDTO } from '../../orderDTO';
import { orderDetailsDTO } from '../../orderDetailsDTO';
import { BehaviorSubject } from 'rxjs';
import { CiboDTO } from '../../ciboDTO';

@Component({
  selector: 'app-cart',
  imports: [HeaderComponent, FooterComponent, CardCartComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit{

  constructor(private cartService: CartService, private menuService: MenuService, private apiService: ApiService, private cdr: ChangeDetectorRef){

  }
  counters: number[] = [];

  private counterSubscription: any;
  carrello: Cart = {cart: [], prodotti: []};
  ciboDTO: CiboDTO[] = [];
  orderDetailsDTO: orderDetailsDTO = {ciboDTO:{name: "Prova", immagine: "path", price: 2},quantity: 1}

  totalPrice: number = 0;

  ngOnInit(): void {
    this.menuService.getCarrelloAsObservable().subscribe(value => {
      this.carrello.cart = value.cart;
      this.getPrezzoTotale();
    })
  }

  incrementCounter(cibo: Cibo){
    this.menuService.incrementCounter(cibo);
    this.cdr.detectChanges()
    //this.counters[id]++;
  }

  decrementCounter(cibo: Cibo){
    this.menuService.decrementCounter(cibo);
    this.cdr.detectChanges()
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
    this.menuService.sendOrder(this.totalPrice);
    this.apiService.getProvaPost("http://localhost:8080/Orders", this.orderDetailsDTO).subscribe(response => {
      console.log(response);
    }, error => {
      console.log(error);
    })
  }

   removeCibo(cibo: Cibo){
    this.menuService.removeCibo(cibo);
   }

   getPrezzoTotale(){
    this.totalPrice = 0;
    this.carrello.cart.forEach(prodotto => {
      this.totalPrice += prodotto.price! * prodotto.quantity!;
      })
   }
}
