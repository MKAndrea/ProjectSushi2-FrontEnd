import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from "../footer/footer.component";
import { CartService } from '../../services/cart.service';
import { Cibo } from '../ProductDTO';
import { CardCartComponent } from "../card-cart/card-cart.component";
import { Cart } from '../cart';
import { Bevanda } from '../bevanda';
import { ApiService } from '../../services/api.service';
import { error } from 'console';
import { orderDTO } from '../../orderDTO';
import { orderDetailsDTO } from '../../orderDetailsDTO';
import { BehaviorSubject } from 'rxjs';
import { CiboDTO } from '../../ciboDTO';
import { MenuService } from '../../services/menu.service';
import { take } from 'rxjs';

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
  carrelloSubject: BehaviorSubject<Cart> = new BehaviorSubject<Cart>({cart: [], prodotti: []})
  carrello: Cart = {cart: [], prodotti: []};
  ciboDTO: CiboDTO[] = [];

  order: orderDTO = {
    orderDetails: []
  }

  mapperForDTO(carrello: Cibo[]): orderDTO {
    this.order = {
      orderDetails: carrello.map(cibo => ({
        quantity: cibo.quantity!,
        product: {
          id: cibo.id!,
          name: cibo.name!,
          ingredients: cibo.ingredients!,
          description: cibo.description!,
          price: cibo.price!,
          productImage: cibo.productImage!,
          category: cibo.category!
        }
      }))
    };
    return this.order;
  }


  totalPrice: number = 0;

  ngOnInit(): void {
    this.menuService.getCarrelloAsObservable().subscribe(value => {
      console.log('Dati del carrello ricevuti:', value);
      this.carrello.cart = value.cart;
      console.log(this.carrello.cart)
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
    sendOrder() {
      this.menuService.getCarrelloAsObservable().pipe(take(1)).subscribe(value => {
        this.carrello.cart = value.cart;
    
        const ORDERDTO = this.mapperForDTO(this.carrello.cart);
        if (confirm(`Stai per inviare l'ordine sei sicuro?`)) {
          this.apiService.sendProductCart("http://localhost:8080/Orders/cart", ORDERDTO).subscribe(() => {
            alert("Ordine inviato!");
            this.carrello.cart.forEach(() => {
              this.menuService.resetCarrello()
            });
            this.carrello.cart = [];
          });
        }
      });
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
